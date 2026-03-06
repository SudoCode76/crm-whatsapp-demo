import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientsService } from '../../../core/services/clients.service';

@Component({
  selector: 'app-lista-clientes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './lista.html',
  styleUrl: './lista.css',
})
export class ListaClientes {
  private svc = inject(ClientsService);
  clients = this.svc.clients;
}
