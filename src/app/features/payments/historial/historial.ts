import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PaymentsService } from '../../../core/services/payments.service';

@Component({
  selector: 'app-historial-pagos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class HistorialPagos {
  private svc = inject(PaymentsService);
  payments = this.svc.payments;
}
