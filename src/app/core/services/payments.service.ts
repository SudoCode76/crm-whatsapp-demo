import { Injectable, signal, computed } from '@angular/core';
import { Payment, PaymentStatus } from '../models/payment.model';
import { PAYMENTS } from '../../data/payments.data';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private _payments = signal<Payment[]>(PAYMENTS);

  payments = this._payments.asReadonly();

  pagados = computed(() => this._payments().filter((p) => p.status === 'pagado'));
  pendientes = computed(() => this._payments().filter((p) => p.status === 'pendiente'));
  expirados = computed(() => this._payments().filter((p) => p.status === 'expirado'));

  totalPagadoHoy = computed(() => {
    const hoy = new Date().toDateString();
    return this.pagados()
      .filter((p) => p.pagadoEn && new Date(p.pagadoEn).toDateString() === hoy)
      .reduce((sum, p) => sum + p.monto, 0);
  });

  getById(id: string): Payment | undefined {
    return this._payments().find((p) => p.id === id);
  }

  getByCliente(clienteId: string): Payment[] {
    return this._payments().filter((p) => p.clienteId === clienteId);
  }

  create(payment: Omit<Payment, 'id' | 'creadoEn' | 'qrCode'>): void {
    const nuevo: Payment = {
      ...payment,
      id: `p${Date.now()}`,
      qrCode: `QR_DATA_${Date.now()}`,
      creadoEn: new Date().toISOString(),
    };
    this._payments.update((list) => [nuevo, ...list]);
  }

  updateStatus(id: string, status: PaymentStatus): void {
    this._payments.update((list) =>
      list.map((p) =>
        p.id === id
          ? { ...p, status, pagadoEn: status === 'pagado' ? new Date().toISOString() : p.pagadoEn }
          : p,
      ),
    );
  }

  reenviar(id: string): void {
    // Simulate re-sending a QR by updating creadoEn timestamp and ensuring status is 'pendiente'
    this._payments.update((list) =>
      list.map((p) =>
        p.id === id ? { ...p, creadoEn: new Date().toISOString(), status: 'pendiente' } : p,
      ),
    );
  }

  renew(id: string): void {
    this._payments.update((list) =>
      list.map((p) => {
        if (p.id !== id) return p;
        const exp = new Date(p.expiraEn);
        exp.setDate(exp.getDate() + 7);
        return { ...p, expiraEn: exp.toISOString(), status: 'pendiente' };
      }),
    );
  }
}
