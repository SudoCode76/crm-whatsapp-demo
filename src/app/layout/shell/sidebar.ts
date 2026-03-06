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

  // local copy to help templates that expect a signal function
  itemsSignal = signal<NavItem[]>([]);

  constructor() {
    // reflect input into a local signal (keeps template expressions simple)
    // when the input changes (parent provides a signal) this effect will update
    // the local signal accordingly.
    effect(() => {
      this.itemsSignal.set(this.items() ?? []);
    });
  }

  onLogout() {
    this.logout.emit();
  }
}
