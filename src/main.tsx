
import { createRoot } from 'react-dom/client'
import "./assets/global.css";
import RoutingConfig from './config/routing.config.tsx'
import { ThemeProvider } from './components/ui/theme-provider.tsx';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <RoutingConfig />
  </ThemeProvider>
)
