import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ClientsService } from '../../../core/services/clients.service';
import { Client } from '../../../core/models/client.model';

const PAGE_SIZE = 10;

/** Palette of gradient pairs for avatars — deterministic by name hash */
const AVATAR_PALETTES = [
  ['from-blue-200', 'to-blue-300', 'text-blue-700'],
  ['from-emerald-200', 'to-emerald-300', 'text-emerald-700'],
  ['from-purple-200', 'to-purple-300', 'text-purple-700'],
  ['from-pink-200', 'to-pink-300', 'text-pink-700'],
  ['from-orange-200', 'to-orange-300', 'text-orange-700'],
  ['from-teal-200', 'to-teal-300', 'text-teal-700'],
  ['from-slate-200', 'to-slate-300', 'text-slate-700'],
  ['from-rose-200', 'to-rose-300', 'text-rose-700'],
];

@Component({
  selector: 'app-lista-clientes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './lista.html',
  styleUrl: './lista.css',
})
export class ListaClientes {
  private svc = inject(ClientsService);

  busqueda = signal('');
  pagina = signal(0);

  // Stats
  totalClientes = computed(() => this.svc.clients().length);
  totalActivos = computed(() => this.svc.activos().length);
  totalMorosos = computed(() => this.svc.morosos().length);
  deudaTotal = computed(() => this.svc.deudaTotalSuma());

  // Filtered list
  private filtrados = computed(() => {
    const q = this.busqueda().toLowerCase().trim();
    if (!q) return this.svc.clients();
    return this.svc
      .clients()
      .filter(
        (c) =>
          c.nombre.toLowerCase().includes(q) ||
          c.telefono.includes(q) ||
          (c.empresa ?? '').toLowerCase().includes(q),
      );
  });

  // Paginated
  totalPaginas = computed(() => Math.max(1, Math.ceil(this.filtrados().length / PAGE_SIZE)));

  clientesPagina = computed(() => {
    const inicio = this.pagina() * PAGE_SIZE;
    return this.filtrados().slice(inicio, inicio + PAGE_SIZE);
  });

  totalFiltrados = computed(() => this.filtrados().length);
  inicioMostrado = computed(() => this.pagina() * PAGE_SIZE + 1);
  finMostrado = computed(() => Math.min((this.pagina() + 1) * PAGE_SIZE, this.filtrados().length));

  onBusqueda(e: Event) {
    this.busqueda.set((e.target as HTMLInputElement).value);
    this.pagina.set(0);
  }

  anterior() {
    if (this.pagina() > 0) this.pagina.update((p) => p - 1);
  }

  siguiente() {
    if (this.pagina() < this.totalPaginas() - 1) this.pagina.update((p) => p + 1);
  }

  /** Two-letter initials from a name */
  iniciales(nombre: string): string {
    const partes = nombre.trim().split(/\s+/);
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }

  /** Deterministic palette index based on name */
  paletteClasses(nombre: string): string[] {
    let hash = 0;
    for (let i = 0; i < nombre.length; i++) hash = (hash * 31 + nombre.charCodeAt(i)) | 0;
    const p = AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length];
    return p;
  }

  /** True if client is considered moroso (has pending debt) */
  esMoroso(c: Client): boolean {
    return (c.deudaTotal ?? 0) > 0;
  }

  /** Friendly display of ultimaInteraccion */
  labelFecha(iso?: string): string {
    if (!iso) return '—';
    const d = new Date(iso);
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    const esHoy =
      d.getDate() === hoy.getDate() &&
      d.getMonth() === hoy.getMonth() &&
      d.getFullYear() === hoy.getFullYear();
    const esAyer =
      d.getDate() === ayer.getDate() &&
      d.getMonth() === ayer.getMonth() &&
      d.getFullYear() === ayer.getFullYear();
    const hhmm = d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
    if (esHoy) return `Hoy, ${hhmm}`;
    if (esAyer) return `Ayer, ${hhmm}`;
    return d.toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
