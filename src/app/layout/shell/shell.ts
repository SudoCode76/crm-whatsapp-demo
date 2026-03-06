import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
  signal,
  afterNextRender,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { InboxService } from '../../core/services/inbox.service';
import { Sidebar } from './sidebar';

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Sidebar],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  private auth = inject(AuthService);
  private inbox = inject(InboxService);

  user = this.auth.currentUser;
  isAdmin = this.auth.isAdmin;
  isSupervisor = this.auth.isSupervisor;
  totalNoLeidos = this.inbox.totalNoLeidos;

  today = new Date().toLocaleDateString('es-GT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  pageTitle = computed(() => {
    // Could be driven by router data in the future; for now a static default.
    return 'Resumen General';
  });

  navItems = computed(() => [
    { label: 'Inicio', icon: 'dashboard', route: '/reports/dashboard', badge: 0 },
    {
      label: 'Bandeja WhatsApp',
      icon: 'forum',
      route: '/inbox',
      badge: this.inbox.totalNoLeidos(),
    },
    { label: 'Clientes', icon: 'group', route: '/clients', badge: 0 },
    { label: 'Pagos y QRs', icon: 'account_balance_wallet', route: '/payments', badge: 0 },
    { label: 'Reportes', icon: 'bar_chart', route: '/reports/dashboard', badge: 0 },
    { label: 'Configuración', icon: 'settings', route: '/admin/company', badge: 0 },
  ]);

  logout() {
    this.auth.logout();
  }

  // Sidebar collapsed state (persisted in localStorage)
  isSidebarCollapsed = signal(false);
  isSidebarMobileOpen = signal(false);

  constructor() {
    // read persisted preference in a browser-safe way
    afterNextRender(() => {
      try {
        const v = localStorage.getItem('cobra:sidebarCollapsed');
        if (v !== null) this.isSidebarCollapsed.set(v === '1');
      } catch (e) {
        // ignore (SSR or security)
      }
    });
  }

  toggleSidebar() {
    // debug
    // eslint-disable-next-line no-console
    console.log('Shell: toggleSidebar invoked, current:', this.isSidebarCollapsed());
    this.isSidebarCollapsed.update((v) => {
      const next = !v;
      afterNextRender(() => {
        try {
          localStorage.setItem('cobra:sidebarCollapsed', next ? '1' : '0');
        } catch (e) {}
      });
      return next;
    });
  }

  openSidebarMobile() {
    this.isSidebarMobileOpen.set(true);
  }

  closeSidebarMobile() {
    this.isSidebarMobileOpen.set(false);
  }
}
