export const METRIC_LABELS = {
  visits: 'Visitas',
  entities: 'Entidades',
  directions: 'Direcciones',
  departments: 'Departamentos',
  areas: 'Áreas',
};

export const METRIC_DESCRIPTIONS = {
  visits: 'visitas por día',
  entities: 'visitas por entidad',
  directions: 'visitas por dirección',
  departments: 'visitas por departamento',
  areas: 'visitas por área',
};

export const CHART_COLORS = {
  primary: {
    blue: {
      100: 'rgb(219 234 254)', // light blue
      200: 'rgb(191 219 254)',
      300: 'rgb(147 197 253)',
      400: 'rgb(96 165 250)',
      500: 'rgb(59 130 246)', // main blue
      600: 'rgb(37 99 235)', // darker blue
    },
    green: {
      100: 'rgb(220 252 231)', // light green
      200: 'rgb(187 247 208)',
      300: 'rgb(134 239 172)',
      400: 'rgb(74 222 128)',
      500: 'rgb(34 197 94)', // main green
      600: 'rgb(22 163 74)', // darker green
    },
  },
};

export const CHART_SCHEMES = {
  bar: [
    CHART_COLORS.primary.blue[500],
    CHART_COLORS.primary.green[500],
    CHART_COLORS.primary.blue[400],
    CHART_COLORS.primary.green[400],
    CHART_COLORS.primary.blue[300],
  ],
  pie: [
    CHART_COLORS.primary.blue[600],
    CHART_COLORS.primary.green[500],
    CHART_COLORS.primary.blue[400],
    CHART_COLORS.primary.green[400],
    CHART_COLORS.primary.blue[300],
    CHART_COLORS.primary.green[300],
  ],
  gradient: {
    from: CHART_COLORS.primary.blue[400],
    to: CHART_COLORS.primary.green[400],
  },
};
