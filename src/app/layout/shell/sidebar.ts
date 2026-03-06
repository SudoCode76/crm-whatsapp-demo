import { Component, ChangeDetectionStrategy, input, output, effect, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItem {
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
  logout = output<void>();
  /** whether the sidebar is collapsed (shows icons only) */
  collapsed = input<boolean>();
  /** mobile overlay open */
  mobileOpen = input<boolean>();

  /** emit when the internal toggle button is clicked */
  toggle = output<void>();
  /** emit when mobile overlay requests close */
  closeMobile = output<void>();

  // local UI helpers for template
  collapseClass = signal('');

  // local copy to help templates that expect a signal function
  itemsSignal = signal<NavItem[]>([]);

  constructor() {
    // reflect input into a local signal (keeps template expressions simple)
    // when the input changes (parent provides a signal) this effect will update
    // the local signal accordingly.
    effect(() => {
      this.itemsSignal.set(this.items() ?? []);
    });
    // update helper class when collapsed changes
    effect(() => {
      this.collapseClass.set(this.collapsed() ? 'collapsed' : 'expanded');
    });
  }

  onLogout() {
    this.logout.emit();
  }

  // invoked by the template when user clicks the collapse button
  onToggle() {
    // debug log so developer can see click reached this handler
    // eslint-disable-next-line no-console
    console.log('Sidebar: onToggle click');

    try {
      const c = this.collapsed as any;
      if (typeof c === 'function' && typeof c.set === 'function') {
        try {
          const curr = c();
          c.set(!curr);
        } catch (e) {
          // ignore
        }
      }
    } catch (e) {
      // ignore
    }

    this.toggle.emit();
  }
}
