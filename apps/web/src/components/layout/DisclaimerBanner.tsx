import { useState, useEffect } from 'react';
import { Button } from '../common/Button';

export function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('disclaimer-dismissed');
    if (dismissed === 'true') {
      setDismissed(true);
    }
  }, []);

  if (dismissed) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-amber-800">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0 8 8 0 01-16 0zM8.707 7.293a1 1 0 00-1.414 1.414L9 12.586l-1.293 1.293a1 1 0 001.414 1.414L12 13.414l2.293 2.293a1 1 0 001.414-1.414L13.414 12l2.293-2.293a1 1 0 00-1.414-1.414L12 10.586 8.707 6.707a1 1 0 00-1.414-1.414L9 8.586l-1.293-1.293a1 1 0 00-1.414 1.414L9 10.586l-2.293-2.293a1 1 0 00-1.414 1.414L9 10.586l-2.293-2.293a1 1 0 00-1.414 1.414L12 10.586 5.707 8.707a1 1 0 00-1.414 1.414L9 13.414l-2.293 2.293a1 1 0 001.414 1.414L10.586 14l2.293 2.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-amber-800">
              <strong>Disclaimer:</strong> As informações apresentadas neste painel têm caráter
              exclusivamente educacional e informativo. Não constituem recomendação de
              investimento, oferta ou solicitação de compra ou venda de quaisquer ativos.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => {
            localStorage.setItem('disclaimer-dismissed', 'true');
            window.location.reload();
          }}>
            Dispensar
          </Button>
        </div>
      </div>
    </div>
  );
}