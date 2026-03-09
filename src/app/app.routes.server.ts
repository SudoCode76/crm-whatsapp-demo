import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Páginas interactivas — renderizadas en el cliente
  { path: 'inbox', renderMode: RenderMode.Client },
  { path: 'inbox/:id', renderMode: RenderMode.Client },
  { path: 'chatbot/monitor', renderMode: RenderMode.Client },
  { path: 'whatsapp-demo', renderMode: RenderMode.Client },

  // Rutas con parámetros dinámicos — renderizadas en el servidor (SSR)
  { path: 'clients/:id', renderMode: RenderMode.Server },
  { path: 'clients/:id/edit', renderMode: RenderMode.Server },
  { path: 'payments/:id', renderMode: RenderMode.Server },
  { path: 'admin/users/:id/edit', renderMode: RenderMode.Server },
  { path: 'settings/users', renderMode: RenderMode.Client },

  // Resto de páginas estáticas — prerenderizadas
  { path: '**', renderMode: RenderMode.Prerender },
];
