import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';
import { USERS } from '../../data/users.data';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private _users = signal<User[]>(USERS);

  users = this._users.asReadonly();
  activos = computed(() => this._users().filter((u) => u.activo));
  agentes = computed(() => this._users().filter((u) => u.rol === 'agente' && u.activo));

  getById(id: string): User | undefined {
    return this._users().find((u) => u.id === id);
  }

  create(user: Omit<User, 'id' | 'creadoEn'>): void {
    const nuevo: User = {
      ...user,
      id: `u${Date.now()}`,
      creadoEn: new Date().toISOString(),
    };
    this._users.update((list) => [...list, nuevo]);
  }

  update(id: string, changes: Partial<Omit<User, 'id' | 'creadoEn'>>): void {
    this._users.update((list) => list.map((u) => (u.id === id ? { ...u, ...changes } : u)));
  }
}
