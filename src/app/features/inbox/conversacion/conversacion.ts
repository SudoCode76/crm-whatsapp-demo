import { Component, ChangeDetectionStrategy, inject, input, signal, computed } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { InboxService } from '../../../core/services/inbox.service';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-conversacion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './conversacion.html',
  styleUrl: './conversacion.css',
})
export class Conversacion {
  private inbox = inject(InboxService);
  private usersService = inject(UsersService);

  /** Parámetro de ruta via withComponentInputBinding */
  id = input.required<string>();

  conversacion = computed(() => this.inbox.getById(this.id()));
  agentes = this.usersService.agentes;
  nuevoMensaje = signal('');
  mostrarAsignacion = signal(false);

  onInput(e: Event) {
    this.nuevoMensaje.set((e.target as HTMLInputElement).value);
  }

  enviar() {
    const texto = this.nuevoMensaje().trim();
    if (!texto || !this.conversacion()) return;
    this.inbox.enviarMensaje(this.id(), texto, 'agente');
    this.nuevoMensaje.set('');
    // Simula respuesta del cliente tras 2s
    this.inbox.simularRespuestaCliente(this.id(), '¡Entendido, gracias!', 2000);
  }

  tomarConversacion() {
    this.inbox.updateStatus(this.id(), 'activa');
  }

  cerrar() {
    this.inbox.updateStatus(this.id(), 'cerrada');
  }
}
