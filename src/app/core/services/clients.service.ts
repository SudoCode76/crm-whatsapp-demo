import { Injectable, signal, computed } from '@angular/core';
import { Client } from '../models/client.model';
import { CLIENTS } from '../../data/clients.data';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private _clients = signal<Client[]>(CLIENTS);

  clients = this._clients.asReadonly();
  activos = computed(() => this._clients().filter((c) => c.activo));

  getById(id: string): Client | undefined {
    return this._clients().find((c) => c.id === id);
  }

  create(client: Omit<Client, 'id' | 'creadoEn'>): void {
    const nuevo: Client = {
      ...client,
      id: `c${Date.now()}`,
      creadoEn: new Date().toISOString(),
    };
    this._clients.update((list) => [nuevo, ...list]);
  }

  update(id: string, changes: Partial<Omit<Client, 'id' | 'creadoEn'>>): void {
    this._clients.update((list) => list.map((c) => (c.id === id ? { ...c, ...changes } : c)));
  }

  delete(id: string): void {
    this._clients.update((list) => list.filter((c) => c.id !== id));
  }
}
