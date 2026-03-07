import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-usuarios',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="page">
      <header class="page-header">
        <h1 class="page-title">Gestión de Usuarios</h1>
        <a routerLink="/admin/users/new" class="btn-primary">+ Nuevo usuario</a>
      </header>
      <div class="table-wrap glass">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            @for (u of users(); track u.id) {
              <tr>
                <td>{{ u.nombre }}</td>
                <td>{{ u.email }}</td>
                <td>{{ u.rol }}</td>
                <td>
                  <span
                    class="badge"
                    [class.badge--active]="u.activo"
                    [class.badge--inactive]="!u.activo"
                    >{{ u.activo ? 'Activo' : 'Inactivo' }}</span
                  >
                </td>
                <td><a [routerLink]="['/admin/users', u.id, 'edit']" class="link">Editar</a></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: `
    /* .page layout handled globally in styles.css */
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .page-title {
      font-size: 1.375rem;
      font-weight: 700;
      color: oklch(95% 0.02 270);
      margin: 0;
    }
    .btn-primary {
      background: var(--brand-primary);
      color: white;
      border: none;
      border-radius: 0.625rem;
      padding: 0.5rem 1.25rem;
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
    }
    .table-wrap {
      border-radius: 1rem;
      overflow: hidden;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }
    .data-table th {
      text-align: left;
      padding: 0.875rem 1rem;
      color: oklch(65% 0.04 270);
      font-weight: 600;
      border-bottom: 1px solid var(--glass-border);
    }
    .data-table td {
      padding: 0.875rem 1rem;
      color: oklch(88% 0.02 270);
      border-bottom: 1px solid oklch(100% 0 0 / 6%);
    }
    .badge {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
    }
    .badge--active {
      background: oklch(52% 0.18 150 / 20%);
      color: oklch(65% 0.18 150);
    }
    .badge--inactive {
      background: oklch(55% 0.02 270 / 20%);
      color: oklch(65% 0.02 270);
    }
    .link {
      color: var(--brand-primary);
      text-decoration: none;
      font-weight: 500;
    }
  `,
})
export class Usuarios {
  private svc = inject(UsersService);
  users = this.svc.users;
}
