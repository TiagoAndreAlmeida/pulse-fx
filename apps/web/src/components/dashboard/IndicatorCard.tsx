import { Link } from 'react-router-dom';
import { type IndicatorCardDTO } from '@/types/api';
import { Star } from 'lucide-react';

interface IndicatorCardProps {
  indicator: IndicatorCardDTO;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isLoading?: boolean;
}

export function IndicatorCard({
  indicator,
  isFavorite,
  onToggleFavorite,
  isLoading = false,
}: IndicatorCardProps) {
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
            disabled={isLoading}
            className={`btn-icon flex-shrink-0 w-8 h-8 ${isFavorite ? 'btn-icon-active' : ''}`}
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            aria-pressed={isFavorite}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <Star
                className="w-4 h-4"
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              />
            )}
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