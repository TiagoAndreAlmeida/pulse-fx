import { useIndicators } from '@/hooks/useIndicators';
import { useFavorites } from '@/hooks/useFavorites';
import { DashboardSkeleton } from '../components/dashboard/DashboardSkeleton';
import { IndicatorGrid } from '../components/dashboard/IndicatorGrid';

export function DashboardPage() {
  const { data: indicators, isLoading, error } = useIndicators();
  const { data: favorites = [] } = useFavorites();

  const favoritesSet = new Set(favorites.map(f => f.id));

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="page-content">
        <div className="text-center py-16">
          <svg className="mx-auto h-10 w-10 text-danger-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.5a2 2 0 001.999-1.999L22 12c0-1.105-.905-2-2-2H4.999A2.001 2.001 0 002 12v8a2 2 0 002 2h12a2 2 0 002-2V7.414c0-.895.393-1.748 1.06-1.96l4.5-3.98c.797-.797 2.047-.797 2.828 0l5.657 5.657c.797.797.797 2.074 0 2.828L12 21" />
          </svg>
          <h3 className="text-lg font-medium text-neutral-900 mb-1">Erro ao carregar indicadores</h3>
          <p className="text-neutral-500 text-sm">Tente recarregar a página</p>
        </div>
      </div>
    );
  }

  if (!indicators || indicators.length === 0) {
    return (
      <div className="page-content">
        <div className="text-center py-16 sm:py-20">
          <svg className="mx-auto h-12 w-12 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2v2m-2 2h4a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 01-2 2h-2a2 2 0 00-2 2v2a2 2 0 01-2 2h-2a2 2 0 00-2 2v2a2 2 0 01-2 2h-2a2 2 0 00-2 2v-2a2 2 0 002-2v-2a2 2 0 002-2H5a2 2 0 01-2-2v-2a2 2 0 012-2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-neutral-900">Nenhum indicador disponível</h3>
          <p className="mt-2 text-neutral-500">A sincronização pode estar em andamento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-950">Dashboard</h1>
        <p className="text-neutral-500 mt-1 text-sm sm:text-base">Acompanhe os principais indicadores macroeconômicos</p>
      </div>

      <section aria-labelledby="indicators-heading" className="section-sm">
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <h2 id="indicators-heading" className="sr-only">Indicadores</h2>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span className="badge badge-neutral">{indicators.length} indicadores</span>
          </div>
        </div>

        <IndicatorGrid
          indicators={indicators}
          favorites={favoritesSet}
          onToggleFavorite={async () => {}}
          isLoading={false}
        />
      </section>
    </div>
  );
}