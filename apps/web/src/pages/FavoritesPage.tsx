import { useFavorites } from '@/hooks/useFavorites';
import { useToggleFavorite } from '@/hooks/useToggleFavorite';
import { IndicatorGrid } from '../components/dashboard/IndicatorGrid';

export function FavoritesPage() {
  const { data: favorites = [], isLoading, error } = useFavorites();
  const { mutate: toggleFavorite } = useToggleFavorite();

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card-compact animate-pulse">
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="h-4 bg-neutral-200 rounded w-3/4" />
                      <div className="flex items-center flex-wrap gap-1.5">
                        <div className="h-3 bg-neutral-200 rounded-full w-16" />
                        <div className="h-3 bg-neutral-200 rounded-full w-20" />
                        <div className="h-3 bg-neutral-200 rounded-full w-24" />
                      </div>
                    </div>
                    <div className="h-9 w-9 bg-neutral-200 rounded-lg flex-shrink-0" />
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-baseline justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="h-2.5 bg-neutral-200 rounded w-1/4" />
                      <div className="h-7 bg-neutral-200 rounded w-1/3" />
                    </div>
                    <div className="flex-shrink-0 text-right space-y-0.5">
                      <div className="h-2.5 bg-neutral-200 rounded w-1/4" />
                      <div className="h-6 bg-neutral-200 rounded w-20" />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-neutral-200 flex-1 min-w-0">
                      <div className="h-3.5 w-3.5 bg-neutral-200 rounded flex-shrink-0" />
                      <div className="h-3 bg-neutral-200 rounded w-40 flex-1" />
                    </div>
                    <div className="h-6 w-16 bg-neutral-200 rounded flex-shrink-0" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-danger-600">Erro ao carregar favoritos</p>
        </div>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="page-content">
        <div className="max-w-4xl mx-auto text-center py-16 sm:py-20">
          <svg className="mx-auto h-12 w-12 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.639 0l2.197 5.699a1 1 0 00.95.69h4.198a1 1 0 01.796 1.693l-3.038 2.831a1 1 0 00-.364 1.118l1.07 4.127a1 1 0 001.502.912l3.602-.49a1 1 0 011.249 1.035l-3.786 4.043a1 1 0 00-.262 1.203l-1.13 5.043a1 1 0 01-1.537.751H5.42a1 1 0 01-.792-.506l-1.714-2.995a1 1 0 01.342-1.356L12 3.333l2.621-1.68a1 1 0 011.112 0l2.586 1.942a1 1 0 011.106-.162l1.914-2.766a1 1 0 01.818-1.119l1.993-2.689a1 1 0 01.752-1.232z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-neutral-900">Nenhum favorito ainda</h3>
          <p className="mt-2 text-neutral-500">Clique na estrela de um indicador no Dashboard para adicioná-lo aos favoritos.</p>
        </div>
      </div>
    );
  }

  const favoritesSet = new Set(favorites.map((f) => f.id));

  return (
    <div className="page-content">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-950">Meus Indicadores Favoritos</h1>
          <p className="text-neutral-500 mt-1 text-sm sm:text-base">Acompanhe seus indicadores favoritos</p>
        </div>

        <IndicatorGrid
          indicators={favorites}
          favorites={favoritesSet}
          onToggleFavorite={toggleFavorite}
          isLoading={false}
        />
      </div>
    </div>
  );
}