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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const getVariationColor = (variation: number) => {
    if (variation > 0) return 'text-success-600';
    if (variation < 0) return 'text-danger-600';
    return 'text-neutral-500';
  };

  const getUnitBadge = (unit: string) => {
    switch (unit) {
      case 'CURRENCY': return 'badge-primary';
      case 'PERCENTAGE': return 'badge-accent';
      default: return 'badge-neutral';
    }
  };

  const getFrequencyBadge = (frequency: string) => {
    return frequency === 'DAILY' ? 'badge-primary' : 'badge-success';
  };

  const getFrequencyLabel = (frequency: string) => {
    return frequency === 'DAILY' ? 'Diário' : 'Mensal';
  };

  return (
    <article className="card-compact card-hover group">
      <div className="card-body-compact">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-neutral-900 truncate pr-2">{indicator.name}</h3>
            <div className="flex items-center flex-wrap gap-1.5 mt-1.5">
              <span className="badge badge-primary text-[10px]">{indicator.source}</span>
              <span className={`badge ${getUnitBadge(indicator.unit)} text-[10px]`}>{indicator.unit}</span>
              <span className={`badge ${getFrequencyBadge(indicator.frequency)} text-[10px]`}>{getFrequencyLabel(indicator.frequency)}</span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(indicator.id);
            }}
            className={`btn-icon flex-shrink-0 ${isFavorite ? 'btn-icon-active' : ''}`}
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            aria-pressed={isFavorite}
          >
            <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.639 0l2.197 5.699a1 1 0 00.95.69h4.198a1 1 0 01.796 1.693l-3.038 2.831a1 1 0 00-.364 1.118l1.07 4.127a1 1 0 001.502.912l3.602-.49a1 1 0 011.249 1.035l-3.786 4.043a1 1 0 00-.262 1.203l-1.13 5.043a1 1 0 01-1.537.751H5.42a1 1 0 01-.792-.506l-1.714-2.995a1 1 0 01.342-1.356L12 3.333l2.621-1.68a1 1 0 011.112 0l2.586 1.942a1 1 0 011.106-.162l1.914-2.766a1 1 0 01.818-1.119l1.993-2.689a1 1 0 01.752-1.232z" fill="currentColor" />
            </svg>
          </button>
        </div>

        <div className="flex items-baseline justify-between gap-3 mb-3 pt-3 border-t border-neutral-100">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Último valor</p>
            <p className="text-xl font-bold text-neutral-900 truncate">{formatValue(indicator.lastValue, indicator.unit)}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Variação</p>
            <p className={`text-lg font-semibold ${getVariationColor(indicator.variation)}`}>
              {indicator.variation > 0 ? '+' : ''}{indicator.variation.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-3 border-t border-neutral-100">
          <div className="flex items-center gap-2 text-xs text-neutral-500 flex-1 min-w-0">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2h-.586a1 1 0 01-.707-.293l-2.414-2.414a1 1 0 00-1.414 0L11 4.414V16a1 1 0 01-1 1h-2a1 1 0 01-1-1V8.586a1 1 0 00-.293-.707l-3-3a1 1 0 00-1.414 0L2.05 10.95a1 1 0 00-.707 1.707l7 7a1 1 0 001.414 0l4.586-4.586a1 1 0 01.707-.293z" /></svg>
            <span className="truncate">Atualizado em {formatDate(indicator.referenceDate)}</span>
          </div>
          <Link
            to={`/indicators/${indicator.id}`}
            className="flex-shrink-0 text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
          >
            Detalhes
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </div>
    </article>
  );
}