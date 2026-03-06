import { Component, ChangeDetectionStrategy, inject, input, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../../core/services/users.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="page">
      <h1 class="page-title">{{ isEdit() ? 'Editar usuario' : 'Nuevo usuario' }}</h1>
      <form class="form-card glass" (ngSubmit)="guardar()">
        <div class="field">
          <label>Nombre *</label
          ><input
            type="text"
            [value]="nombre()"
            (input)="nombre.set($any($event.target).value)"
            required
          />
        </div>
        <div class="field">
          <label>Email *</label
          ><input
            type="email"
            [value]="email()"
            (input)="email.set($any($event.target).value)"
            required
          />
        </div>
        <div class="field">
          <label>Rol *</label>
          <select [value]="rol()" (change)="rol.set($any($event.target).value)">
            <option value="admin">Admin</option>
            <option value="supervisor">Supervisor</option>
            <option value="agente">Agente</option>
          </select>
        </div>
        <button type="submit" class="btn-primary">
          {{ isEdit() ? 'Guardar cambios' : 'Crear usuario' }}
        </button>
      </form>
    </div>
  `,
  styles: `
    .page {
      padding: 1.5rem;
    }
    .page-title {
      font-size: 1.375rem;
      font-weight: 700;
      color: oklch(95% 0.02 270);
      margin: 0 0 1.5rem;
    }
    .form-card {
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 480px;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }
    .field label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: oklch(75% 0.04 270);
    }
    .field input,
    .field select {
      background: oklch(100% 0 0 / 8%);
      border: 1px solid var(--glass-border);
      border-radius: 0.625rem;
      padding: 0.625rem 0.875rem;
      color: oklch(93% 0.01 270);
      font-size: 0.9rem;
      outline: none;
    }
    .field input:focus,
    .field select:focus {
      border-color: var(--brand-primary);
    }
    .btn-primary {
      background: var(--brand-primary);
      color: white;
      border: none;
      border-radius: 0.75rem;
      padding: 0.75rem;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 0.5rem;
    }
  `,
})
export class UserForm {
  private svc = inject(UsersService);
  private router = inject(Router);

  id = input<string>();
  isEdit = computed(() => !!this.id());
  existing = computed(() => (this.id() ? this.svc.getById(this.id()!) : undefined));

  nombre = signal(this.existing()?.nombre ?? '');
  email = signal(this.existing()?.email ?? '');
  rol = signal<UserRole>(this.existing()?.rol ?? 'agente');

  guardar() {
    const data = {
      nombre: this.nombre(),
      email: this.email(),
      rol: this.rol(),
      activo: true,
      avatar: this.nombre().slice(0, 2).toUpperCase(),
    };
    if (this.isEdit()) {
      this.svc.update(this.id()!, data);
    } else {
      this.svc.create(data);
    }
    this.router.navigate(['/admin/users']);
  }
}
