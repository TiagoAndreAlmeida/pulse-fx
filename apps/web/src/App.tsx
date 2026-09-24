import { Routes, Route } from 'react-router-dom';
import { QueryProvider } from '@/services/queryClient';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { DisclaimerBanner } from '@/components/layout/DisclaimerBanner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DashboardPage } from '@/pages/DashboardPage';
import { IndicatorDetailPage } from '@/pages/IndicatorDetailPage';
import { FavoritesPage } from '@/pages/FavoritesPage';

function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <div className="min-h-screen flex flex-col bg-gray-50">
          <DisclaimerBanner />
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/indicators/:id" element={<IndicatorDetailPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;