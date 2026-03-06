import { Component, ChangeDetectionStrategy, inject, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientsService } from '../../../core/services/clients.service';
import { PaymentsService } from '../../../core/services/payments.service';
import { InboxService } from '../../../core/services/inbox.service';

@Component({
  selector: 'app-detalle-cliente',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
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
}
