import { IndicatorCard } from './IndicatorCard';
import { type IndicatorCardDTO } from '@/types/api';
import { CardGridSkeleton } from '../common/LoadingSpinner';

interface IndicatorGridProps {
  indicators: IndicatorCardDTO[];
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  isLoading?: boolean;
}

export function IndicatorGrid({ indicators, favorites, onToggleFavorite, isLoading }: IndicatorGridProps) {
  if (isLoading) {
    return <CardGridSkeleton count={4} />;
  }

  if (indicators.length === 0) {
    return (
      <div className="text-center py-16 sm:py-20">
        <svg className="mx-auto h-12 w-12 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2v2m-2 2h4a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 01-2 2h-2a2 2 0 00-2 2v2a2 2 0 01-2 2h-2a2 2 0 00-2 2v2a2 2 0 01-2 2h-2a2 2 0 00-2 2v2a2 2 0 01-2 2h-2a2 2 0 00-2 2v-2a2 2 0 002-2v-2a2 2 0 002-2H5a2 2 0 01-2-2v-2a2 2 0 012-2z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-neutral-900">Nenhum indicador encontrado</h3>
        <p className="mt-2 text-neutral-500">Nenhum indicador disponível no momento.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-responsive">
      {indicators.map((indicator) => (
        <IndicatorCard
          key={indicator.id}
          indicator={indicator}
          isFavorite={favorites.has(indicator.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}