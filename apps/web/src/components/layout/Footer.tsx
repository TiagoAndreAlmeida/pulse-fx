import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Pulse FX</h3>
            <p className="text-sm text-gray-600">
              Acompanhamento de câmbio e indicadores macroeconômicos Brasil/EUA.
              Dados educacionais, não é recomendação de investimento.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Links Úteis</h3>
            <nav className="space-y-2">
              <Link to="/" className="text-sm text-gray-600 hover:text-blue-600 block">Dashboard</Link>
              <Link to="/favorites" className="text-sm text-gray-600 hover:text-blue-600 block">Favoritos</Link>
            </nav>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Fontes de Dados</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>BCB - SGS (Sistema Gerenciador de Séries)</li>
              <li>FRED - Federal Reserve Economic Data</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-500">
          <p>Pulse FX - Dados educacionais. Não é recomendação de investimento.</p>
        </div>
      </div>
    </footer>
  );
}