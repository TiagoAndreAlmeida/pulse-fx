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
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-neutral-200 rounded w-1/4 mx-auto"></div>
            <div className="h-96 bg-neutral-200 rounded-xl"></div>
            <div className="mt-8 h-64 bg-neutral-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !indicator) {
    return (
      <div className="page-content">
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-danger-600">Não foi possível carregar os detalhes do indicador.</p>
        </div>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="page-content">
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-danger-600">Indicador não especificado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-primary hover:text-primary-hover text-sm font-medium mb-4"
          >
            ← Voltar ao Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">{indicator.name}</h1>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            <span className="badge badge-primary">{indicator.source}</span>
            <span className="badge badge-neutral text-xs">{indicator.unit}</span>
            <span className="badge badge-primary text-xs">
              {indicator.frequency === 'DAILY' ? 'Diário' : 'Mensal'}
            </span>
          </div>
        </div>

        <section aria-labelledby="chart-heading" className="card-elevated">
          <div className="card-header">
            <h2 id="chart-heading" className="text-lg font-semibold text-neutral-900">Série Temporal</h2>
          </div>
          <div className="card-body">
            <div className="h-96">
              <IndicatorChart observations={indicator.observations} />
            </div>
          </div>
        </section>

        <section aria-labelledby="table-heading" className="card-elevated">
          <div className="card-header">
            <h2 id="table-heading" className="text-lg font-semibold text-neutral-900">Histórico de Observações</h2>
          </div>
          <div className="card-body">
            <ObservationsTable observations={indicator.observations} unit={indicator.unit} />
          </div>
        </section>

        <section aria-labelledby="limitations-heading" className="card-elevated">
          <div className="card-header">
            <h2 id="limitations-heading" className="text-lg font-semibold text-neutral-900">Limitações dos Dados</h2>
          </div>
          <div className="card-body">
            <DataLimitations indicatorId={indicator.id} />
          </div>
        </section>
      </div>
    </div>
  );
}