import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const PALETTE = ['#4f83cc', '#22c55e', '#f59e0b', '#ef4444', '#a78bfa', '#06b6d4'];

const tooltipStyle = {
  contentStyle: { backgroundColor: '#18181b', border: '1px solid #374151', color: '#f4f4f5', borderRadius: 8 },
  itemStyle: { color: '#e5e7eb' },
};
const axisProps = { stroke: '#4b5563', tick: { fill: '#9ca3af', fontSize: 11 } };

function ChartRenderer({ chartData, height = 320 }) {
  if (!chartData) return null;

  const { chart_type, labels = [], series = [] } = chartData;

  /* bar / histogram */
  if (chart_type === 'bar' || chart_type === 'histogram') {
    const data = labels.map((name, i) => ({
      name,
      ...Object.fromEntries(series.map((s) => [s.name, s.data[i]])),
    }));
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="name" {...axisProps} />
          <YAxis {...axisProps} />
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
          {series.map((s, i) => (
            <Bar key={s.name} dataKey={s.name} fill={PALETTE[i % PALETTE.length]} radius={[3, 3, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  /* line */
  if (chart_type === 'line') {
    const data = labels.map((name, i) => ({
      name,
      ...Object.fromEntries(series.map((s) => [s.name, s.data[i]])),
    }));
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="name" {...axisProps} />
          <YAxis {...axisProps} />
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
          {series.map((s, i) => (
            <Line key={s.name} type="monotone" dataKey={s.name}
              stroke={PALETTE[i % PALETTE.length]} strokeWidth={2} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  /* pie */
  if (chart_type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={series} dataKey="value" nameKey="name"
            cx="50%" cy="50%" outerRadius={height / 3}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}>
            {series.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
          </Pie>
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  /* scatter */
  if (chart_type === 'scatter') {
    const s = series[0] || {};
    return (
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="x" name={chartData.x_column} {...axisProps} />
          <YAxis dataKey="y" name={chartData.y_column} {...axisProps} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} {...tooltipStyle} />
          <Scatter name={s.name} data={s.data || []} fill={PALETTE[0]} />
        </ScatterChart>
      </ResponsiveContainer>
    );
  }

  return <p className="text-gray-500 text-center py-8 text-sm">Unsupported chart type: {chart_type}</p>;
}

export default ChartRenderer;
