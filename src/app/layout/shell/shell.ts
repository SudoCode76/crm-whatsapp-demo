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
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
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
  private router = inject(Router);

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
    { id: 'nav-inicio', label: 'Inicio', icon: 'dashboard', route: '/inicio', badge: 0 },
    {
      id: 'nav-bandeja',
      label: 'Bandeja WhatsApp',
      icon: 'forum',
      route: '/inbox',
      badge: this.inbox.totalNoLeidos(),
    },
    { id: 'nav-clientes', label: 'Clientes', icon: 'group', route: '/clients', badge: 0 },
    {
      id: 'nav-pagos',
      label: 'Pagos y QRs',
      icon: 'account_balance_wallet',
      route: '/payments',
      badge: 0,
    },
    {
      id: 'nav-reportes',
      label: 'Reportes',
      icon: 'bar_chart',
      route: '/reports/dashboard',
      badge: 0,
    },
    {
      id: 'nav-config',
      label: 'Configuración',
      icon: 'settings',
      route: '/settings',
      badge: 0,
    },
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

      // Hide topbar on /inbox routes by toggling a class on body. Run inside
      // afterNextRender to ensure document is available (SSR-safe).
      const setBodyTopbar = (url: string) => {
        try {
          document.body.classList.toggle('hide-topbar', url.startsWith('/inbox'));
        } catch {
          /* ignore */
        }
      };

      // initial
      try {
        setBodyTopbar(this.router.url);
      } catch {
        /* ignore */
      }

      // subscribe to route changes
      const sub = this.router.events.subscribe((ev) => {
        if (ev instanceof NavigationEnd) {
          setBodyTopbar(ev.urlAfterRedirects || ev.url);
        }
      });

      // cleanup when component destroyed
      effect(() => sub.unsubscribe(), { injector: this.injector });
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

  // Focus management for mobile sidebar overlay
  private _previousFocus: HTMLElement | null = null;
  private _mobileKeyHandler: ((ev: KeyboardEvent) => void) | null = null;

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
    // Save previously focused element so we can restore focus on close.
    try {
      this._previousFocus = (document.activeElement as HTMLElement) ?? null;
    } catch {
      this._previousFocus = null;
    }

    this.isSidebarMobileOpen.set(true);

    // After the overlay is rendered, move focus into the sidebar and install
    // a basic focus trap (Tab / Shift+Tab) and Escape-to-close behavior.
    afterNextRender(() => {
      const host = document.querySelector('app-sidebar') as HTMLElement | null;
      if (!host) return;

      // Focus the first focusable element inside the sidebar.
      const focusable = Array.from(
        host.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length));

      if (focusable.length) {
        focusable[0].focus();
      } else {
        // fallback: focus the host so keyboard users are inside the overlay
        host.focus?.();
      }

      // Key handler: Trap Tab and handle Escape to close overlay.
      this._mobileKeyHandler = (ev: KeyboardEvent) => {
        if (ev.key === 'Escape' || ev.key === 'Esc') {
          ev.preventDefault();
          this.closeSidebarMobile();
          return;
        }

        if (ev.key !== 'Tab') return;
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!ev.shiftKey && document.activeElement === last) {
          ev.preventDefault();
          first.focus();
        } else if (ev.shiftKey && document.activeElement === first) {
          ev.preventDefault();
          last.focus();
        }
      };

      document.addEventListener('keydown', this._mobileKeyHandler as EventListener);
    });
  }

  closeSidebarMobile(): void {
    this.isSidebarMobileOpen.set(false);

    // Remove the key handler and restore focus to the previously focused
    // element (if any).
    try {
      if (this._mobileKeyHandler) {
        document.removeEventListener('keydown', this._mobileKeyHandler as EventListener);
        this._mobileKeyHandler = null;
      }
    } catch {
      // ignore
    }

    try {
      if (this._previousFocus) this._previousFocus.focus();
    } catch {
      // ignore
    } finally {
      this._previousFocus = null;
    }
  }
}
