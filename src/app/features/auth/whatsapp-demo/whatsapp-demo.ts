import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { InboxService } from '../../../core/services/inbox.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-whatsapp-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe],
  templateUrl: './whatsapp-demo.html',
  styleUrl: './whatsapp-demo.css',
})
export class WhatsappDemo {
  private inbox = inject(InboxService);
  private router = inject(Router);

  /** Usamos la conversación 1 (Ana García) para la demo */
  conversacion = this.inbox.getById('conv1')!;
  mensajeNuevo = signal('');

  onInput(e: Event) {
    this.mensajeNuevo.set((e.target as HTMLInputElement).value);
  }

  enviar() {
    const texto = this.mensajeNuevo().trim();
    if (!texto) return;
    this.inbox.simularRespuestaCliente('conv1', texto, 0);
    this.mensajeNuevo.set('');
    // El agente responde automáticamente tras 1.5s
    this.inbox.enviarMensaje(
      'conv1',
      '¡Gracias por tu mensaje! Un agente te responderá pronto.',
      'bot',
    );
  }

  volver() {
    this.router.navigate(['/login']);
  }
}
