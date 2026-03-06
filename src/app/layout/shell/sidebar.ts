import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
})
export class Sidebar {
  items = input.required<NavItem[]>();
  user = input.required<any>();

  /** True when sidebar shows icons only (no labels). Parent owns and passes the boolean value. */
  collapsed = input(false);
  /** True when the mobile overlay is visible. */
  mobileOpen = input(false);

  /** Emits the desired next collapsed state when the user clicks the internal toggle. */
  toggle = output<boolean>();
  /** Emits when the mobile overlay close button is clicked. */
  closeMobile = output<void>();
  /** Emits when the user clicks the logout button. */
  logout = output<void>();

  onToggle(): void {
    this.toggle.emit(!this.collapsed());
  }

  onLogout(): void {
    this.logout.emit();
  }
}
