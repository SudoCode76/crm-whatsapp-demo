import { Component, ChangeDetectionStrategy, inject, input, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PaymentsService } from '../../../core/services/payments.service';

@Component({
  selector: 'app-detalle-pago',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe],
  templateUrl: './detalle.html',
  styleUrl: './detalle.css',
})
export class DetallePago {
  private svc = inject(PaymentsService);
  id = input.required<string>();
  pago = computed(() => this.svc.getById(this.id()));

  simularPago() {
    if (this.pago()?.status === 'pendiente') {
      this.svc.updateStatus(this.id(), 'pagado');
    }
  }
}
