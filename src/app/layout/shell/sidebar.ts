import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../../core/models/user.model';

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  host: {
    // Bindings en el elemento host para que los selectores CSS de shell.css
    // como app-sidebar[data-mobile-open='1'] funcionen correctamente.
    '[attr.data-mobile-open]': "mobileOpen() ? '1' : '0'",
    '[attr.data-collapsed]': "collapsed() ? '1' : '0'",
    '[style.width.px]': 'collapsed() ? 72 : 240',
    '[style.min-width.px]': 'collapsed() ? 72 : 240',
  },
})
export class Sidebar {
  items = input.required<NavItem[]>();
  user = input.required<User | null>();

  /** true cuando el sidebar muestra solo iconos (sin etiquetas). */
  collapsed = input(false);
  /** true cuando el overlay móvil está visible. */
  mobileOpen = input(false);

  /** Emite el siguiente estado deseado de collapsed cuando el usuario pulsa el toggle interno. */
  toggle = output<boolean>();
  /** Emite cuando se pulsa el botón cerrar del overlay móvil. */
  closeMobile = output<void>();
  /** Emite cuando el usuario pulsa el botón de logout. */
  logout = output<void>();

  onToggle(): void {
    this.toggle.emit(!this.collapsed());
  }

  onLogout(): void {
    this.logout.emit();
  }
}
