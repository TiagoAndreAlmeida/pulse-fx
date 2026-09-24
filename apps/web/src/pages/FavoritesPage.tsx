import { useFavorites } from '@/hooks/useFavorites';
import { IndicatorGrid } from '../components/dashboard/IndicatorGrid';

export function FavoritesPage() {
  const { data: favorites = [], isLoading, error } = useFavorites();

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content text-center py-12">
        <p className="text-red-600">Erro ao carregar favoritos</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Meus Indicadores Favoritos</h1>
        <p className="text-gray-600 mt-1">Acompanhe seus indicadores favoritos</p>
      </div>

      <IndicatorGrid
        indicators={favorites}
        favorites={new Set(favorites.map(f => f.id))}
        onToggleFavorite={async () => {}}
        isLoading={false}
      />
    </div>
  );
}