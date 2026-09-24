import { useParams, Link } from 'react-router-dom';
import { useIndicatorDetail } from '@/hooks/useIndicatorDetail';
import { IndicatorChart } from '../components/indicator-detail/IndicatorChart';
import { ObservationsTable } from '../components/indicator-detail/ObservationsTable';
import { DataLimitations } from '../components/indicator-detail/DataLimitations';

export function IndicatorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: indicator, isLoading, error } = useIndicatorDetail(id);

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
          <div className="mt-8 h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error || !indicator) {
    return (
      <div className="page-content text-center py-12">
        <p className="text-red-600">Não foi possível carregar os detalhes do indicador.</p>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="page-content text-center py-12">
        <p className="text-red-600">Indicador não especificado.</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="mb-8">
        <Link to="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 inline-block">
          ← Voltar ao Dashboard
        </Link>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{indicator.name}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="badge badge-info">{indicator.source}</span>
            <span className="badge badge-neutral text-xs">{indicator.unit}</span>
            <span className="badge badge-info text-xs">{indicator.frequency === 'DAILY' ? 'Diário' : 'Mensal'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <section aria-labelledby="chart-heading" className="card">
              <div className="card-header">
                <h2 id="chart-heading" className="text-lg font-semibold text-gray-900">Série Temporal</h2>
              </div>
              <div className="card-body">
                <div className="h-96">
                  <IndicatorChart
                    observations={indicator.observations}
                  />
                </div>
              </div>
            </section>

            <section aria-labelledby="table-heading" className="card">
              <div className="card-header">
                <h2 id="table-heading" className="text-lg font-semibold text-gray-900">Histórico de Observações</h2>
              </div>
              <div className="card-body">
                <ObservationsTable observations={indicator.observations} unit={indicator.unit} />
              </div>
            </section>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <section aria-labelledby="limitations-heading" className="card">
              <div className="card-header">
                <h2 id="limitations-heading" className="text-lg font-semibold text-gray-900">Limitações dos Dados</h2>
              </div>
              <div className="card-body">
                <DataLimitations indicatorId={indicator.id} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}