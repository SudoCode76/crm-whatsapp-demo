import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { PaymentsService } from '../../../core/services/payments.service';
import { ClientsService } from '../../../core/services/clients.service';
import { Payment, PaymentStatus } from '../../../core/models/payment.model';

type TabFilter = 'todos' | PaymentStatus;

/** Validez options for the quick form */
const VALIDEZ_OPTIONS: { label: string; hours: number }[] = [
  { label: '24 horas', hours: 24 },
  { label: '48 horas', hours: 48 },
  { label: '7 días', hours: 24 * 7 },
  { label: 'Sin caducidad', hours: 24 * 365 * 10 },
];

@Component({
  selector: 'app-historial-pagos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class HistorialPagos {
  private svc = inject(PaymentsService);
  private clientsSvc = inject(ClientsService);

  // ── Tabs ──────────────────────────────────────────────────────────────────
  tab = signal<TabFilter>('todos');
  readonly tabs: { key: TabFilter; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'pagado', label: 'Pagados' },
    { key: 'pendiente', label: 'Pendientes' },
    { key: 'expirado', label: 'Expirados' },
  ];

  filtrados = computed<Payment[]>(() => {
    const t = this.tab();
    if (t === 'todos') return this.svc.payments();
    return this.svc.payments().filter((p) => p.status === t);
  });

  // ── Stats ─────────────────────────────────────────────────────────────────
  cobrosHoy = computed(() => {
    const hoy = new Date().toDateString();
    return this.svc
      .pagados()
      .filter((p) => p.pagadoEn && new Date(p.pagadoEn).toDateString() === hoy)
      .reduce((s, p) => s + p.monto, 0);
  });

  qrsActivos = computed(() => this.svc.pendientes().length);
  montoPendiente = computed(() => this.svc.pendientes().reduce((s, p) => s + p.monto, 0));
  totalMes = computed(() => {
    const ahora = new Date();
    return this.svc
      .pagados()
      .filter((p) => {
        if (!p.pagadoEn) return false;
        const d = new Date(p.pagadoEn);
        return d.getFullYear() === ahora.getFullYear() && d.getMonth() === ahora.getMonth();
      })
      .reduce((s, p) => s + p.monto, 0);
  });

  // ── Por vencer pronto: pendientes cuya expiraEn < 24h ────────────────────
  porVencer = computed(() => {
    const limite = Date.now() + 24 * 60 * 60 * 1000;
    return this.svc
      .pendientes()
      .filter((p) => new Date(p.expiraEn).getTime() <= limite)
      .slice(0, 5);
  });

  horasParaVencer(expiraEn: string): string {
    const diff = new Date(expiraEn).getTime() - Date.now();
    if (diff <= 0) return 'Vencido';
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (h === 0) return `Vence en ${m} min`;
    return `Vence en ${h}h ${m}min`;
  }

  // ── Quick form ────────────────────────────────────────────────────────────
  clientes = this.clientsSvc.activos;
  readonly validezOpts = VALIDEZ_OPTIONS;

  qClienteId = signal('');
  qMonto = signal('');
  qConcepto = signal('');
  qValidezHoras = signal(24);
  qGenerado = signal(false);

  onClienteChange(e: Event) {
    this.qClienteId.set((e.target as HTMLSelectElement).value);
  }
  onMontoChange(e: Event) {
    this.qMonto.set((e.target as HTMLInputElement).value);
  }
  onConceptoChange(e: Event) {
    this.qConcepto.set((e.target as HTMLInputElement).value);
  }
  onValidezChange(e: Event) {
    this.qValidezHoras.set(Number((e.target as HTMLSelectElement).value));
  }

  generarRapido() {
    const cliente = this.clientsSvc.getById(this.qClienteId());
    const monto = parseFloat(this.qMonto());
    if (!cliente || !monto || monto <= 0) return;
    const expira = new Date(Date.now() + this.qValidezHoras() * 60 * 60 * 1000);
    this.svc.create({
      clienteId: cliente.id,
      clienteNombre: cliente.nombre,
      monto,
      moneda: 'Bs.',
      descripcion: this.qConcepto() || 'Cobro rápido',
      status: 'pendiente',
      expiraEn: expira.toISOString(),
    });
    // Reset form
    this.qClienteId.set('');
    this.qMonto.set('');
    this.qConcepto.set('');
    this.qValidezHoras.set(24);
    this.qGenerado.set(true);
    setTimeout(() => this.qGenerado.set(false), 2500);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  labelFecha(iso: string): string {
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
    return d.toLocaleDateString('es', { day: 'numeric', month: 'short' }) + `, ${hhmm}`;
  }

  iniciales(nombre: string): string {
    const p = nombre.trim().split(/\s+/);
    if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
    return (p[0][0] + p[p.length - 1][0]).toUpperCase();
  }
}
