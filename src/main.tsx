
import { createRoot } from 'react-dom/client'
import "./assets/global.css";
import RoutingConfig from './config/routing.config.tsx'
import { ThemeProvider } from './components/ui/theme-provider.tsx';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <RoutingConfig />
    <Toaster 
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: '#333',
          color: '#fff',
        },
        success: {
          style: {
            background: '#059669',
          },
        },
        error: {
          style: {
            background: '#dc2626',
          },
          duration: 6000,
        },
      }}
    />
  </ThemeProvider>
)
