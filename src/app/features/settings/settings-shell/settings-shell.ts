import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-settings-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './settings-shell.html',
  styleUrl: './settings-shell.css',
})
export class SettingsShell {
  private router = inject(Router);

  navItems = [
    {
      label: 'Empresa',
      route: '/settings/company',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15l.75 1.5v16.5H3.75V4.5L4.5 3zM9 21V12h6v9M9 7.5h1.5M9 11.25h1.5M13.5 7.5H15M13.5 11.25H15"/></svg>`,
    },
    {
      label: 'Comportamiento del Bot',
      route: '/settings/bot',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.75a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v.75H21v1.5H3v-1.5h5.25v-.75zM5.25 7.5h13.5v10.5a2.25 2.25 0 01-2.25 2.25H7.5a2.25 2.25 0 01-2.25-2.25V7.5zM9 12.75a.75.75 0 100-1.5.75.75 0 000 1.5zm6 0a.75.75 0 100-1.5.75.75 0 000 1.5z"/></svg>`,
    },
    {
      label: 'Usuarios y Roles',
      route: '/settings/users',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>`,
    },
  ];
}
