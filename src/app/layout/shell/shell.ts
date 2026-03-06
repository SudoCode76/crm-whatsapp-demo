import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
  signal,
  effect,
  afterNextRender,
  OnDestroy,
  Injector,
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
export class Shell implements OnDestroy {
  private auth = inject(AuthService);
  private inbox = inject(InboxService);
  private injector = inject(Injector);

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

  pageTitle = computed(() => 'Resumen General');

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

  // ── Sidebar state ────────────────────────────────────────────────────────
  isSidebarCollapsed = signal(false);
  isSidebarMobileOpen = signal(false);

  // DOM handle appended to document.body so it is never clipped by any
  // overflow/transform on ancestor elements.
  private _handleEl: HTMLButtonElement | null = null;
  private _handleClick = () => this.onSidebarToggleRequest(!this.isSidebarCollapsed());
  private _handleKey = (ev: KeyboardEvent) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this.onSidebarToggleRequest(!this.isSidebarCollapsed());
    }
  };

  constructor() {
    // Read persisted preference after first render (SSR-safe).
    afterNextRender(() => {
      try {
        const v = localStorage.getItem('cobra:sidebarCollapsed');
        if (v !== null) this.isSidebarCollapsed.set(v === '1');
      } catch {
        // ignore — SSR or storage access denied
      }

      // Mount the floating handle into document.body.
      // effect() is called here with an explicit Injector so it is properly
      // tracked and cleaned up — this is the correct pattern when you need
      // to run an effect outside of a component constructor injection context.
      const btn = document.createElement('button');
      btn.className = 'sidebar-handle';
      btn.setAttribute('aria-label', 'Toggle sidebar');
      btn.setAttribute('title', 'Toggle sidebar');
      btn.setAttribute('type', 'button');
      btn.tabIndex = 0;

      const span = document.createElement('span');
      span.className = 'material-symbols-outlined';
      btn.appendChild(span);

      btn.addEventListener('click', this._handleClick);
      btn.addEventListener('keydown', this._handleKey);
      document.body.appendChild(btn);
      this._handleEl = btn;

      // Keep the handle icon and position in sync with the signal.
      // Using injector: this.injector ensures the effect is tied to the
      // component's lifetime and is cleaned up on destroy.
      effect(
        () => {
          if (!this._handleEl) return;
          const collapsed = this.isSidebarCollapsed();
          this._handleEl.style.left = `${collapsed ? 72 : 240}px`;
          const ic = this._handleEl.querySelector('.material-symbols-outlined');
          if (ic) ic.textContent = collapsed ? 'chevron_right' : 'chevron_left';
        },
        { injector: this.injector },
      );
    });
  }

  ngOnDestroy(): void {
    try {
      if (this._handleEl) {
        this._handleEl.removeEventListener('click', this._handleClick);
        this._handleEl.removeEventListener('keydown', this._handleKey);
        this._handleEl.parentElement?.removeChild(this._handleEl);
        this._handleEl = null;
      }
    } catch {
      // ignore
    }
  }

  // ── Sidebar actions ──────────────────────────────────────────────────────
  onSidebarToggleRequest(desired: boolean): void {
    this.isSidebarCollapsed.set(desired);
    try {
      localStorage.setItem('cobra:sidebarCollapsed', desired ? '1' : '0');
    } catch {
      // ignore — storage access denied
    }
  }

  openSidebarMobile(): void {
    this.isSidebarMobileOpen.set(true);
  }

  closeSidebarMobile(): void {
    this.isSidebarMobileOpen.set(false);
  }
}
