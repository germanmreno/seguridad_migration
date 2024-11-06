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

export function VisitsDashboard() {
  const [timeRange, setTimeRange] = useState("week");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardStats(timeRange);
        setDashboardData(data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [timeRange]);

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
  const COLORS = ['#2563eb', '#0891b2', '#7c3aed', '#db2777', '#84cc16'];

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="p-8 space-y-6 bg-background/95 min-h-screen backdrop-blur-sm rounded-xl border border-primary/10 shadow-lg">
          {/* Time Range Selector */}
          <div className="flex justify-end mb-6">
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
            {/* Daily Visits Chart */}
            <Card className="col-span-2 hover:shadow-lg transition-shadow border-primary/10 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Visitas Diarias</CardTitle>
                <CardDescription className="text-sm text-primary/60">
                  Número de visitas por día en el período seleccionado
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2 h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.dailyVisits}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                    <XAxis
                      dataKey="date"
                      stroke="currentColor"
                      opacity={0.7}
                    />
                    <YAxis
                      stroke="currentColor"
                      opacity={0.7}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      formatter={(value) => <span className="text-primary/80">{value}</span>}
                    />
                    <Bar
                      name="Número de visitas"
                      dataKey="visits"
                      fill="rgb(37 99 235)"
                      radius={[4, 4, 0, 0]}
                      opacity={0.8}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Entity Distribution Chart */}
            <Card className="hover:shadow-lg transition-shadow border-primary/10 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Distribución por Entidad</CardTitle>
                <CardDescription className="text-sm text-primary/60">
                  Distribución de visitas por entidad
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.entityDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={130}
                      innerRadius={85}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={true}
                    >
                      {charts.entityDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          opacity={0.8}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Frequent Visitors */}
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
