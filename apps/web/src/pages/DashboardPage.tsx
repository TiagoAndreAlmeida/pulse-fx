import { useIndicators } from '@/hooks/useIndicators';
import { useFavorites } from '@/hooks/useFavorites';
import { DashboardSkeleton } from '../components/dashboard/DashboardSkeleton';
import { IndicatorCard } from '@/components/dashboard/IndicatorCard';

export function DashboardPage() {
  const { data: indicators, isLoading, error } = useIndicators();
  const { data: favorites = [] } = useFavorites();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erro ao carregar indicadores</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Acompanhe os principais indicadores macroeconômicos</p>
      </div>

      <section aria-labelledby="indicators-heading">
        <h2 id="indicators-heading" className="sr-only">Indicadores</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {indicators?.map((indicator) => (
            <IndicatorCard
              key={indicator.id}
              indicator={indicator}
              isFavorite={favorites.some(f => f.id === indicator.id)}
              onToggleFavorite={async () => {}}
            />
          ))}
        </div>
      </section>
    </div>
  );
}