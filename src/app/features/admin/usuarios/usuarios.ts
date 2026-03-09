import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../../core/services/users.service';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-usuarios',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios {
  private svc = inject(UsersService);

  users = this.svc.users;

  busqueda = signal('');

  /* Invite form */
  invNombre = signal('');
  invEmail = signal('');
  invRol = signal<UserRole>('agente');
  invitado = signal(false);

  /* ── Computeds ─────────────────────────────────────────────────────── */
  filteredUsers = computed(() => {
    const q = this.busqueda().toLowerCase().trim();
    if (!q) return this.users();
    return this.users().filter(
      (u) => u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  });

  admins = computed(() => this.users().filter((u) => u.rol === 'admin'));
  supervisores = computed(() => this.users().filter((u) => u.rol === 'supervisor'));
  agentes = computed(() => this.users().filter((u) => u.rol === 'agente'));

  /* ── Helpers ───────────────────────────────────────────────────────── */
  rolLabel(rol: UserRole): string {
    const map: Record<UserRole, string> = {
      admin: 'Administrador',
      supervisor: 'Supervisor',
      agente: 'Agente',
    };
    return map[rol];
  }

  labelAcceso(iso: string | undefined): string {
    if (!iso) return 'Nunca';
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffH = Math.floor(diffMs / 3_600_000);
    if (diffH < 1) return 'Hace menos de 1h';
    if (diffH < 24) return `Hace ${diffH}h`;
    const diffD = Math.floor(diffH / 24);
    if (diffD === 1) return 'Ayer';
    if (diffD < 7) return `Hace ${diffD} días`;
    return d.toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  invitar() {
    if (!this.invNombre().trim() || !this.invEmail().trim()) return;
    this.svc.create({
      nombre: this.invNombre().trim(),
      email: this.invEmail().trim(),
      rol: this.invRol(),
      activo: true,
      avatar: this.invNombre()
        .trim()
        .split(' ')
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? '')
        .join(''),
    });
    this.invNombre.set('');
    this.invEmail.set('');
    this.invRol.set('agente');
    this.invitado.set(true);
    setTimeout(() => this.invitado.set(false), 3000);
  }
}
