import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './routes/router';
import { AuthProvider } from '@/hooks/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css';

function App() {
  const queryClient = new QueryClient();

  queryClient.setDefaultOptions({
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      retryDelay: 1000,
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <AppRouter />
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
