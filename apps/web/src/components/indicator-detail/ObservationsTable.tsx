import { type ObservationPointDTO } from '@/types/api';

interface ObservationsTableProps {
  observations: ObservationPointDTO[];
  unit: string;
}

export function ObservationsTable({ observations, unit }: ObservationsTableProps) {
  if (!observations || observations.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-400">
        Nenhuma observação disponível
      </div>
    );
  }

  const formatValue = (value: number) => {
    if (unit === 'CURRENCY') {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(value);
    }
    if (unit === 'PERCENTAGE') {
      return value.toFixed(2) + '%';
    }
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  };

  const sortedObservations = [...observations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  function formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateString;
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Data</th>
            <th className="text-right">Valor</th>
          </tr>
        </thead>
        <tbody>
          {sortedObservations.map((obs) => (
            <tr key={obs.date}>
              <td className="whitespace-nowrap">{formatDate(obs.date)}</td>
              <td className="text-right font-medium">{formatValue(obs.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}