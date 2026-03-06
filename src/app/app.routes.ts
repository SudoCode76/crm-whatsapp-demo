import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Redirigir raíz a login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Auth (sin shell)
  {
    path: '',
    loadComponent: () => import('./layout/auth-layout/auth-layout').then((m) => m.AuthLayout),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
      },
      {
        path: 'whatsapp-demo',
        loadComponent: () =>
          import('./features/auth/whatsapp-demo/whatsapp-demo').then((m) => m.WhatsappDemo),
      },
    ],
  },

  // App protegida (con shell)
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    canActivate: [authGuard],
    children: [
      // Inbox
      {
        path: 'inbox',
        loadComponent: () => import('./features/inbox/bandeja/bandeja').then((m) => m.Bandeja),
      },
      {
        path: 'inbox/:id',
        loadComponent: () =>
          import('./features/inbox/conversacion/conversacion').then((m) => m.Conversacion),
      },

      // Clients
      {
        path: 'clients',
        loadComponent: () => import('./features/clients/lista/lista').then((m) => m.ListaClientes),
      },
      {
        path: 'clients/new',
        loadComponent: () => import('./features/clients/form/form').then((m) => m.FormCliente),
      },
      {
        path: 'clients/:id',
        loadComponent: () =>
          import('./features/clients/detalle/detalle').then((m) => m.DetalleCliente),
      },
      {
        path: 'clients/:id/edit',
        loadComponent: () => import('./features/clients/form/form').then((m) => m.FormCliente),
      },

      // Chatbot
      {
        path: 'chatbot/monitor',
        loadComponent: () =>
          import('./features/chatbot/monitor/monitor').then((m) => m.ChatbotMonitor),
      },
      {
        path: 'chatbot/config',
        loadComponent: () =>
          import('./features/chatbot/config/config').then((m) => m.ChatbotConfig),
      },

      // Payments
      {
        path: 'payments',
        loadComponent: () =>
          import('./features/payments/historial/historial').then((m) => m.HistorialPagos),
      },
      {
        path: 'payments/new',
        loadComponent: () =>
          import('./features/payments/generar-qr/generar-qr').then((m) => m.GenerarQr),
      },
      {
        path: 'payments/:id',
        loadComponent: () =>
          import('./features/payments/detalle/detalle').then((m) => m.DetallePago),
      },

      // Reports
      {
        path: 'reports/dashboard',
        loadComponent: () =>
          import('./features/reports/dashboard/dashboard').then((m) => m.ReportsDashboard),
      },
      {
        path: 'reports/paid-vs-unpaid',
        loadComponent: () =>
          import('./features/reports/pagados-vs-no/pagados-vs-no').then((m) => m.PagadosVsNo),
      },
      {
        path: 'reports/period',
        loadComponent: () =>
          import('./features/reports/por-periodo/por-periodo').then((m) => m.PorPeriodo),
      },
      {
        path: 'reports/compare',
        loadComponent: () =>
          import('./features/reports/comparativo/comparativo').then((m) => m.Comparativo),
      },

      // Admin — solo admin/supervisor
      {
        path: 'admin/users',
        loadComponent: () => import('./features/admin/usuarios/usuarios').then((m) => m.Usuarios),
        canActivate: [roleGuard(['admin', 'supervisor'])],
      },
      {
        path: 'admin/users/new',
        loadComponent: () => import('./features/admin/user-form/user-form').then((m) => m.UserForm),
        canActivate: [roleGuard(['admin'])],
      },
      {
        path: 'admin/users/:id/edit',
        loadComponent: () => import('./features/admin/user-form/user-form').then((m) => m.UserForm),
        canActivate: [roleGuard(['admin'])],
      },
      {
        path: 'admin/company',
        loadComponent: () =>
          import('./features/admin/config-empresa/config-empresa').then((m) => m.ConfigEmpresa),
        canActivate: [roleGuard(['admin'])],
      },
      {
        path: 'admin/templates',
        loadComponent: () =>
          import('./features/admin/plantillas/plantillas').then((m) => m.Plantillas),
        canActivate: [roleGuard(['admin', 'supervisor'])],
      },
      {
        path: 'admin/log',
        loadComponent: () => import('./features/admin/log/log').then((m) => m.LogActividad),
        canActivate: [roleGuard(['admin', 'supervisor'])],
      },
    ],
  },

  // Fallback
  { path: '**', redirectTo: 'login' },
];
