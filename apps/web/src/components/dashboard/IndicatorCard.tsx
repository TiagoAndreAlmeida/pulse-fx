import { Link } from 'react-router-dom';
import { type IndicatorCardDTO } from '@/types/api';

interface IndicatorCardProps {
  indicator: IndicatorCardDTO;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => Promise<void>;
}

export function IndicatorCard({ indicator, isFavorite, onToggleFavorite }: IndicatorCardProps) {
  const formatValue = (value: number, unit: string) => {
    if (unit === 'CURRENCY') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      }).format(value);
    }
    if (unit === 'PERCENTAGE') {
      return value.toFixed(2) + '%';
    }
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  };

  return (
    <article className="card group hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{indicator.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="badge-info text-xs">{indicator.source}</span>
              <span className={`badge ${indicator.unit === 'CURRENCY' ? 'badge-info' : indicator.unit === 'PERCENTAGE' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'} text-xs`}>
                {indicator.unit}
              </span>
              <span className={`badge ${indicator.frequency === 'DAILY' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'} text-xs`}>
                {indicator.frequency === 'DAILY' ? 'Diário' : 'Mensal'}
              </span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(indicator.id);
            }}
            className="p-1.5 rounded-lg transition-colors text-gray-400 hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <svg
              className={`w-5 h-5 transition-colors ${isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`}
              fill={isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.639 0l2.197 5.699a1 1 0 00.95.69h4.198a1 1 0 01.796 1.693l-3.038 2.831a1 1 0 00-.364 1.118l1.07 4.127a1 1 0 001.502.912l3.602-.49a1 1 0 011.249 1.035l-3.786 4.043a1 1 0 00-.262 1.203l-1.13 5.043a1 1 0 01-1.537.751H5.42a1 1 0 01-.792-.506l-1.714-2.995a1 1 0 01.342-1.356L12 3.333l2.621-1.68a1 1 0 011.112 0l2.586 1.942a1 1 0 011.106-.162l1.914-2.766a1 1 0 01.818-1.119l1.993-2.689a1 1 0 01.752-1.232z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-sm text-gray-500">Último valor</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatValue(indicator.lastValue, indicator.unit)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Variação</p>
            <p className={`text-lg font-semibold ${indicator.variation > 0 ? 'text-green-600' : indicator.variation < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {indicator.variation > 0 ? '+' : ''}{indicator.variation.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2h-.586a1 1 0 01-.707-.293l-2.414-2.414a1 1 0 00-1.414 0L11 4.414V16a1 1 0 01-1 1h-2a1 1 0 01-1-1V8.586a1 1 0 00-.293-.707l-3-3a1 1 0 00-1.414 0L2.05 10.95a1 1 0 00-.707 1.707l7 7a1 1 0 001.414 0l4.586-4.586a1 1 0 01.707-.293z" /></svg>
          <span className="text-xs text-gray-500 ml-1">Atualizado em {new Date(indicator.referenceDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
        </div>
        <Link
          to={`/indicators/${indicator.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          Detalhes
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </Link>
      </div>
    </article>
  );
}