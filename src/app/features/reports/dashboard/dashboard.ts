import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { PaymentsService } from '../../../core/services/payments.service';
import { InboxService } from '../../../core/services/inbox.service';
import { Payment } from '../../../core/models/payment.model';

type ActivityItem = {
  id: string;
  type: 'payment' | 'conversation';
  title: string;
  subtitle?: string;
  amount?: number;
  time: string;
};

@Component({
  selector: 'app-reports-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class ReportsDashboard {
  private svc = inject(PaymentsService);
  private inbox = inject(InboxService);

  totalPagados = computed(() => this.svc.pagados().reduce((s, p) => s + p.monto, 0));
  totalPendientes = computed(() => this.svc.pendientes().reduce((s, p) => s + p.monto, 0));
  totalExpirados = computed(() => this.svc.expirados().reduce((s, p) => s + p.monto, 0));
  cantPagados = computed(() => this.svc.pagados().length);
  cantPendientes = computed(() => this.svc.pendientes().length);
  cantExpirados = computed(() => this.svc.expirados().length);
  totalDia = this.svc.totalPagadoHoy;

  qrPendientes = computed(() => this.svc.pendientes());

  // Chart: total pagado por los últimos 7 días (incluye hoy)
  chartLast7 = computed(() => {
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });
    const payments = this.svc.payments();
    return days.map((day) => {
      const key = day.toDateString();
      return payments
        .filter((p) => p.status === 'pagado' && p.pagadoEn)
        .filter((p) => new Date(p.pagadoEn!).toDateString() === key)
        .reduce((s, p) => s + p.monto, 0);
    });
  });

  // SVG sparkline paths based on chartLast7()
  sparkArea = computed(() => {
    const values = this.chartLast7();
    const max = Math.max(...values, 1);
    const n = values.length;
    if (n === 0) return '';
    const points = values.map((v, i) => {
      const x = (i / (n - 1)) * 100;
      const y = 50 - (v / max) * 45; // keep bottom padding
      return { x, y };
    });
    const top = points.map((p, i) => `${i === 0 ? 'L' : 'L'}${p.x},${p.y}`).join(' ');
    const d = `M0,50 ${top} L100,50 Z`;
    return d;
  });

  sparkLine = computed(() => {
    const values = this.chartLast7();
    const max = Math.max(...values, 1);
    const n = values.length;
    if (n === 0) return '';
    const pts = values
      .map((v, i) => {
        const x = (i / (n - 1)) * 100;
        const y = 50 - (v / max) * 45;
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
      })
      .join(' ');
    return pts;
  });

  recentActivity = computed<ActivityItem[]>(() => {
    const payments = this.svc
      .payments()
      .slice()
      .sort((a, b) => (b.pagadoEn || b.creadoEn).localeCompare(a.pagadoEn || a.creadoEn))
      .slice(0, 5)
      .map(
        (p) =>
          ({
            id: p.id,
            type: 'payment' as const,
            title: `Pago ${p.clienteNombre}`,
            subtitle: p.descripcion,
            amount: p.monto,
            time: p.pagadoEn ?? p.creadoEn,
          }) as ActivityItem,
      );

    const convs = this.inbox
      .conversations()
      .slice()
      .sort((a, b) => (b.ultimoMensajeAt || '').localeCompare(a.ultimoMensajeAt || ''))
      .slice(0, 5)
      .map(
        (c) =>
          ({
            id: c.id,
            type: 'conversation' as const,
            title: `Mensaje: ${c.clienteNombre}`,
            subtitle: c.ultimoMensaje,
            time: c.ultimoMensajeAt ?? new Date().toISOString(),
          }) as ActivityItem,
      );

    return [...payments, ...convs].sort((a, b) => b.time.localeCompare(a.time)).slice(0, 8);
  });

  reenviarQR(id: string) {
    // Simulate re-sending the QR: update creadoEn to now so it surfaces as recent
    this.svc.reenviar(id);
    // In a real app we'd show a toast; here we keep it simple
    console.log('QR reenviado', id);
  }

  renovarQR(id: string) {
    // Renew QR expiration: push expiry +7 days and set status to pendiente
    this.svc.renew(id);
    console.log('QR renovado', id);
  }
}
