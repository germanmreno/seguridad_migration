import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BarChart as BarChartIcon, NotebookTabs } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { CHART_COLORS, CHART_SCHEMES, METRIC_LABELS, METRIC_DESCRIPTIONS } from '../constants/chartConstants';

export function PDFLayout({ stats, charts, selectedMetric, timeRange }) {
  const timeRangeLabels = {
    day: 'último día',
    week: 'última semana',
    month: 'último mes',
    all: 'todo el período'
  };

  return (
    <div className="w-[210mm] bg-white p-8">
      {/* Header with Icons */}
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <div className="flex items-center space-x-2">
          <NotebookTabs className="h-5 w-5" />
          <span className="font-semibold">REGISTRO DE VISITAS</span>
        </div>
        <div className="flex items-center space-x-2">
          <BarChartIcon className="h-5 w-5" />
          <span className="font-semibold">PANEL DE ESTADÍSTICAS</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-[#24387d] text-white p-6 rounded-lg mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Reporte de Estadísticas de Visitas
          </h1>
          <div className="text-sm">
            {format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: es })}
          </div>
        </div>
        <div className="mt-2 text-white/80">
          Período: {timeRangeLabels[timeRange]}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">Total Visitas</div>
          <div className="text-2xl font-bold text-blue-700">{stats.totalVisits}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-600 font-medium">Visitas Activas</div>
          <div className="text-2xl font-bold text-green-700">{stats.activeVisits}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">Visitantes Únicos</div>
          <div className="text-2xl font-bold text-blue-700">{stats.uniqueVisitors}</div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {selectedMetric === 'visits'
            ? 'Visitas Diarias'
            : `${METRIC_LABELS[selectedMetric]} más visitadas`}
        </h2>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.mainChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name={METRIC_LABELS[selectedMetric]}>
                {charts.mainChart.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_SCHEMES.bar[index % CHART_SCHEMES.bar.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Distribución por Entidad
          </h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.entityDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={false}
                >
                  {charts.entityDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_SCHEMES.pie[index % CHART_SCHEMES.pie.length]}
                    />
                  ))}
                </Pie>
                <Legend layout="vertical" align="right" verticalAlign="middle" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Frequent Visitors */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Visitantes Frecuentes
          </h2>
          <div className="space-y-2">
            {charts.frequentVisitors.slice(0, 5).map((visitor, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg"
                style={{
                  background: `linear-gradient(90deg, ${CHART_SCHEMES.gradient.from}${Math.round((visitor.visits / charts.frequentVisitors[0].visits) * 20)} 0%, transparent 100%)`
                }}
              >
                <span className="font-medium">{visitor.name}</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {visitor.visits} visitas
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t text-center text-gray-500 text-sm">
        Generado el {format(new Date(), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
      </div>
    </div>
  );
} 