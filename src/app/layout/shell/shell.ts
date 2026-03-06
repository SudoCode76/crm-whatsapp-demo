import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
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
}
