import { useEffect, useState } from "react";
import { fetchDashboardStats } from "./form/services/visitorService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Layout } from "../layout/Layout";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from "@/components/ui/button";
import ReactDOM from 'react-dom/client';
import { PDFLayout } from "./PDFLayout";
import { CHART_COLORS, CHART_SCHEMES, METRIC_LABELS, METRIC_DESCRIPTIONS } from "../constants/chartConstants";
import { DownloadIcon, Printer } from "lucide-react";

export function VisitsDashboard() {
  const [timeRange, setTimeRange] = useState("week");
  const [selectedMetric, setSelectedMetric] = useState("visits");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardStats(timeRange, selectedMetric);
        setDashboardData(data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [timeRange, selectedMetric]);

  const handleExportPDF = async () => {
    // Create temporary PDF layout
    const pdfContainer = document.createElement('div');
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '-9999px';
    document.body.appendChild(pdfContainer);

    // Render PDF layout
    const root = ReactDOM.createRoot(pdfContainer);
    root.render(
      <PDFLayout
        stats={stats}
        charts={charts}
        selectedMetric={selectedMetric}
        timeRange={timeRange}
      />
    );

    // Wait for charts to render
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');

      // Use A4 dimensions
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate image dimensions to fit A4
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add multiple pages if content is too long
      let heightLeft = imgHeight;
      let position = 0;
      let pageNumber = 1;

      while (heightLeft >= 0) {
        if (pageNumber > 1) {
          pdf.addPage();
        }

        pdf.addImage(
          imgData,
          'PNG',
          0,
          position,
          imgWidth,
          imgHeight
        );

        heightLeft -= pageHeight;
        position -= pageHeight;
        pageNumber++;
      }

      pdf.save('dashboard-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar el PDF');
    } finally {
      // Cleanup
      document.body.removeChild(pdfContainer);
    }
  };

  if (loading || !dashboardData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-primary font-medium">Cargando...</div>
        </div>
      </Layout>
    );
  }

  const { stats, charts } = dashboardData;

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-[#24387d] text-white rounded-t-lg w-full">
          <div className="h-12 flex items-center justify-between p-4">
            <h1 className="primary-text p-0 m-0">
              PANEL DE ESTADÍSTICAS DE VISITAS
            </h1>
            <Button
              onClick={handleExportPDF}
              className="bg-white text-[#24387d] hover:bg-white/90"
            >
              <Printer className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>
        <div
          id="dashboard-content"
          className="p-8 space-y-6 bg-background/95 min-h-screen backdrop-blur-sm rounded-xl border border-primary/10 shadow-lg"
        >
          {/* Time Range and Metric Selectors */}
          <div className="flex justify-end mb-6 space-x-4">
            <Select
              value={selectedMetric}
              onValueChange={(value) => setSelectedMetric(value)}
            >
              <SelectTrigger className="w-[180px] bg-card border-primary/20 hover:border-primary/50 transition-colors">
                <SelectValue placeholder="Seleccionar métrica" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visits">Visitas</SelectItem>
                <SelectItem value="directions">Direcciones</SelectItem>
                <SelectItem value="entities">Entidades</SelectItem>
                <SelectItem value="departments">Departamentos</SelectItem>
                <SelectItem value="areas">Áreas</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={timeRange}
              onValueChange={(value) => setTimeRange(value)}
            >
              <SelectTrigger className="w-[180px] bg-card border-primary/20 hover:border-primary/50 transition-colors">
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Último día</SelectItem>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Último mes</SelectItem>
                <SelectItem value="all">Todo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Statistics Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow border-primary/10 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold text-primary">Total Visitas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.totalVisits}</div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow border-primary/10 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold text-primary">Visitas Activas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.activeVisits}</div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow border-primary/10 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold text-primary">
                  Visitantes Únicos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.uniqueVisitors}</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Main Chart */}
            <Card className="col-span-2 hover:shadow-lg transition-shadow border-primary/10 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-primary">
                  {selectedMetric === 'visits'
                    ? 'Visitas Diarias'
                    : `${METRIC_LABELS[selectedMetric]} más visitadas`}
                </CardTitle>
                <CardDescription className="text-sm text-primary/60">
                  {`Distribución de ${METRIC_DESCRIPTIONS[selectedMetric]} en el período seleccionado`}
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2 h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.charts.mainChart}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={CHART_COLORS.primary.blue[100]}
                      opacity={0.2}
                    />
                    <XAxis
                      dataKey="name"
                      stroke={CHART_COLORS.primary.blue[500]}
                      opacity={0.7}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{ fill: CHART_COLORS.primary.blue[500] }}
                    />
                    <YAxis
                      stroke={CHART_COLORS.primary.blue[500]}
                      opacity={0.7}
                      tick={{ fill: CHART_COLORS.primary.blue[500] }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        color: CHART_COLORS.primary.blue[600]
                      }}
                      cursor={{ fill: CHART_COLORS.primary.blue[100], opacity: 0.2 }}
                    />
                    <Bar
                      name={METRIC_LABELS[selectedMetric]}
                      dataKey="value"
                      radius={[4, 4, 0, 0]}
                    >
                      {dashboardData.charts.mainChart.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_SCHEMES.bar[index % CHART_SCHEMES.bar.length]}
                          opacity={0.8}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribution Pie Chart */}
            <Card className="hover:shadow-lg transition-shadow border-primary/10 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-primary">
                  {selectedMetric === 'areas' ? 'Distribución por Departamento' : 'Distribución por Entidad'}
                </CardTitle>
                <CardDescription className="text-sm text-primary/60">
                  {selectedMetric === 'areas'
                    ? 'Distribución de áreas por departamento'
                    : 'Distribución de visitas por entidad'}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={selectedMetric === 'areas'
                        ? dashboardData.charts.departmentDistribution
                        : dashboardData.charts.entityDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={130}
                      innerRadius={85}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={{ stroke: CHART_COLORS.primary.blue[400] }}
                    >
                      {(selectedMetric === 'areas'
                        ? dashboardData.charts.departmentDistribution
                        : dashboardData.charts.entityDistribution
                      ).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_SCHEMES.pie[index % CHART_SCHEMES.pie.length]}
                          opacity={0.8}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        color: CHART_COLORS.primary.blue[600]
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Frequent Visitors Card */}
            <Card className="hover:shadow-lg transition-shadow border-primary/10 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Visitantes Frecuentes</CardTitle>
                <CardDescription className="text-sm text-primary/60">
                  Top 5 visitantes más frecuentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {charts.frequentVisitors.map((visitor, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-colors"
                      style={{
                        background: `linear-gradient(90deg, ${CHART_SCHEMES.gradient.from}${Math.round((visitor.visits / charts.frequentVisitors[0].visits) * 20)} 0%, transparent 100%)`
                      }}
                    >
                      <span className="font-medium text-primary/80">{visitor.name}</span>
                      <span className="text-primary bg-primary/10 px-3 py-1 rounded-full text-sm">
                        {visitor.visits} visitas
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
