interface DataLimitationsProps {
  indicatorId: string;
}

export function DataLimitations({ indicatorId }: DataLimitationsProps) {
  const limitationsMap: Record<string, string[]> = {
    USD_BRL: [
      'Dados do Banco Central do Brasil (SGS - Código 1).',
      'Cotação PTAX de venda, calculada como média ponderada das transações do mercado interbancário.',
      'Disponível apenas em dias úteis. Finais de semana e feriados nacionais não possuem cotação.',
      'Pode haver revisões posteriores nas cotações pelo BCB.',
    ],
    SELIC: [
      'Dados do Banco Central do Brasil (SGS - Código 432).',
      'Taxa Selic Meta definida pelo Comitê de Política Monetária (COPOM).',
      'Válida a partir da data da decisão do COPOM até a próxima reunião.',
      'Não reflete a taxa Selic over (overnight), apenas a meta.',
    ],
    FEDFUNDS: [
      'Dados do Federal Reserve Economic Data (FRED) - Series ID: FEDFUNDS.',
      'Taxa efetiva dos fundos federais (Federal Funds Effective Rate).',
      'Taxa de juros overnight pela qual instituições depositárias emprestam saldos de reserva.',
      'Dados mensais (média mensal da taxa efetiva diária).',
      'Pode haver atraso na publicação e revisões posteriores pelo Federal Reserve.',
    ],
    CPI_US: [
      'Dados do Federal Reserve Economic Data (FRED) - Series ID: CPIAUCSL.',
      'Índice de Preços ao Consumidor para Todos os Consumidores Urbanos (CPI-U).',
      'Índice base 1982-1984 = 100.',
      'Dados mensais com ajuste sazonal.',
      'Pode haver revisões posteriores pelo Bureau of Labor Statistics (BLS).',
    ],
  };

  const limitations = limitationsMap[indicatorId] || [
    'Dados obtidos de fontes públicas oficiais.',
    'Podem haver atrasos na publicação e revisões posteriores.',
    'Valores sujeitos a revisões posteriores pelas fontes oficiais.',
  ];

  return (
    <div className="prose prose-sm max-w-none text-neutral-700">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Limitações e Observações</h3>
      <ul className="list-disc list-inside space-y-2 text-neutral-700">
        {limitations.map((limitation, index) => (
          <li key={index} className="ml-4">
            {limitation}
          </li>
        ))}
      </ul>
      <div className="mt-4 p-3 bg-warning-100 border border-warning-200 rounded-lg">
        <p className="text-sm text-warning-800">
          <strong>Disclaimer:</strong> As informações apresentadas têm caráter exclusivamente educacional
          e informativo. Não constituem recomendação de investimento, oferta ou solicitação de compra
          ou venda de quaisquer ativos.
        </p>
      </div>
    </div>
  );
}