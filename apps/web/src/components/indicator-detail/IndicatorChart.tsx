import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { type ObservationPointDTO } from '@/types/api';

interface IndicatorChartProps {
  observations: ObservationPointDTO[];
}

export function IndicatorChart({ observations }: IndicatorChartProps) {
  if (!observations || observations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Nenhum dado disponivel para exibicao do grafico
      </div>
    );
  }

  const chartData = [...observations].reverse().map((obs) => {
    return {
      date: new Date(obs.date).toLocaleDateString('pt-BR', { month: 'short', day: '2-digit' }),
      value: obs.value,
    };
  });

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} tickMargin={10} />
          <YAxis tickFormatter={value => value.toLocaleString('pt-BR')} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: '#2563eb' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}