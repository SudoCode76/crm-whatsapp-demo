import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentsService } from '../../../core/services/payments.service';
import { ClientsService } from '../../../core/services/clients.service';

@Component({
  selector: 'app-generar-qr',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './generar-qr.html',
  styleUrl: './generar-qr.css',
})
export class GenerarQr {
  private paymentsSvc = inject(PaymentsService);
  private clientsSvc = inject(ClientsService);
  private router = inject(Router);

  clientes = this.clientsSvc.activos;
  clienteId = signal('');
  monto = signal(0);
  descripcion = signal('');

  generar() {
    const cliente = this.clientsSvc.getById(this.clienteId());
    if (!cliente || this.monto() <= 0) return;
    const expira = new Date();
    expira.setDate(expira.getDate() + 1);
    this.paymentsSvc.create({
      clienteId: cliente.id,
      clienteNombre: cliente.nombre,
      monto: this.monto(),
      moneda: 'GTQ',
      descripcion: this.descripcion(),
      status: 'pendiente',
      expiraEn: expira.toISOString(),
    });
    this.router.navigate(['/payments']);
  }
}
