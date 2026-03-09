import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { InboxService } from '../../../core/services/inbox.service';
import { ConversationStatus } from '../../../core/models/conversation.model';

type TabKey = 'todas' | ConversationStatus;

@Component({
  selector: 'app-bandeja',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterOutlet, SlicePipe],
  templateUrl: './bandeja.html',
  styleUrl: './bandeja.css',
})
export class Bandeja {
  private inbox = inject(InboxService);
  private router = inject(Router);

  filtro = signal<TabKey>('todas');
  busqueda = signal('');

  conversaciones = this.inbox.conversations;

  /** Tab definitions with label and color class for their counter */
  readonly tabs = [
    { key: 'todas' as TabKey, label: 'Todos', colorClass: 'count--default' },
    { key: 'bot' as TabKey, label: 'Bot', colorClass: 'count--bot' },
    { key: 'activa' as TabKey, label: 'Agente', colorClass: 'count--agente' },
    { key: 'espera' as TabKey, label: 'Esperando', colorClass: 'count--espera' },
  ];

  /** Counts for tab badges */
  cuentas = computed(() => ({
    todas: this.conversaciones().length,
    bot: this.conversaciones().filter((c) => c.status === 'bot').length,
    activa: this.conversaciones().filter((c) => c.status === 'activa').length,
    espera: this.conversaciones().filter((c) => c.status === 'espera').length,
    cerrada: this.conversaciones().filter((c) => c.status === 'cerrada').length,
  }));

  /** Filtered list combining tab + search */
  lista = computed(() => {
    const q = this.busqueda().toLowerCase().trim();
    let base =
      this.filtro() === 'todas'
        ? this.conversaciones()
        : this.conversaciones().filter((c) => c.status === this.filtro());
    if (q) {
      base = base.filter(
        (c) =>
          c.clienteNombre.toLowerCase().includes(q) ||
          c.clienteTelefono.includes(q) ||
          c.ultimoMensaje.toLowerCase().includes(q),
      );
    }
    return base;
  });

  /** Returns the count for a given tab key */
  countFor(key: TabKey): number {
    return this.cuentas()[
      key === 'activa'
        ? 'activa'
        : key === 'bot'
          ? 'bot'
          : key === 'espera'
            ? 'espera'
            : key === 'cerrada'
              ? 'cerrada'
              : 'todas'
    ];
  }

  setFiltro(f: TabKey) {
    this.filtro.set(f);
  }

  onBusqueda(e: Event) {
    this.busqueda.set((e.target as HTMLInputElement).value);
  }

  /** Returns true when the given conversation id is the active route */
  isActive(id: string): boolean {
    return this.router.url === `/inbox/${id}`;
  }
}
