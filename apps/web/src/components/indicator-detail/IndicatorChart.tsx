import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { type ObservationPointDTO } from '@/types/api';

interface IndicatorChartProps {
  observations: ObservationPointDTO[];
}

export function IndicatorChart({ observations }: IndicatorChartProps) {
  if (!observations || observations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-400">
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
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-neutral-200)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: 'var(--color-neutral-500)' }}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <YAxis
            tickFormatter={value => value.toLocaleString('pt-BR')}
            tick={{ fontSize: 12, fill: 'var(--color-neutral-500)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid var(--color-neutral-200)',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-md)',
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: 'var(--color-primary)' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}