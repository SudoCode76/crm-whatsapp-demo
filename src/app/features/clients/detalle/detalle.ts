import { Component, ChangeDetectionStrategy, inject, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';
import { ClientsService } from '../../../core/services/clients.service';
import { PaymentsService } from '../../../core/services/payments.service';
import { InboxService } from '../../../core/services/inbox.service';
import { Client } from '../../../core/models/client.model';

/** Palette of gradient pairs for the large hero avatar */
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
  selector: 'app-detalle-cliente',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DecimalPipe, DatePipe],
  templateUrl: './detalle.html',
  styleUrl: './detalle.css',
})
export class DetalleCliente {
  private clientsSvc = inject(ClientsService);
  private paymentsSvc = inject(PaymentsService);
  private inboxSvc = inject(InboxService);

  id = input.required<string>();

  client = computed(() => this.clientsSvc.getById(this.id()));
  pagos = computed(() => this.paymentsSvc.getByCliente(this.id()));
  conversaciones = computed(() =>
    this.inboxSvc.conversations().filter((c) => c.clienteId === this.id()),
  );

  totalPagado = computed(() =>
    this.pagos()
      .filter((p) => p.status === 'pagado')
      .reduce((s, p) => s + p.monto, 0),
  );

  totalPendiente = computed(() =>
    this.pagos()
      .filter((p) => p.status === 'pendiente')
      .reduce((s, p) => s + p.monto, 0),
  );

  /** Two-letter initials */
  iniciales(nombre: string): string {
    const partes = nombre.trim().split(/\s+/);
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }

  /** Deterministic avatar palette based on name hash */
  paletteClasses(nombre: string): string[] {
    let hash = 0;
    for (let i = 0; i < nombre.length; i++) hash = (hash * 31 + nombre.charCodeAt(i)) | 0;
    return AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length];
  }

  esMoroso(c: Client): boolean {
    return (c.deudaTotal ?? 0) > 0;
  }

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
