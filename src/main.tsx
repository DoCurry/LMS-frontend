
import { createRoot } from 'react-dom/client'
import "./assets/global.css";
import "flowbite";
import RoutingConfig from './config/routing.config.tsx'

createRoot(document.getElementById('root')!).render(
  <RoutingConfig />
)
