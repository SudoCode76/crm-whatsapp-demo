import { Injectable, signal, computed } from '@angular/core';
import { Conversation, Message, ConversationStatus } from '../models/conversation.model';
import { CONVERSATIONS } from '../../data/conversations.data';

@Injectable({ providedIn: 'root' })
export class InboxService {
  private _conversations = signal<Conversation[]>(CONVERSATIONS);

  conversations = this._conversations.asReadonly();

  activas = computed(() => this._conversations().filter((c) => c.status === 'activa'));
  enEspera = computed(() => this._conversations().filter((c) => c.status === 'espera'));
  cerradas = computed(() => this._conversations().filter((c) => c.status === 'cerrada'));
  bot = computed(() => this._conversations().filter((c) => c.status === 'bot'));
  totalNoLeidos = computed(() =>
    this._conversations().reduce((sum, c) => sum + c.mensajesNoLeidos, 0),
  );

  getById(id: string): Conversation | undefined {
    return this._conversations().find((c) => c.id === id);
  }

  updateStatus(id: string, status: ConversationStatus): void {
    this._conversations.update((list) => list.map((c) => (c.id === id ? { ...c, status } : c)));
  }

  asignar(id: string, agenteId: string, agenteNombre: string): void {
    this._conversations.update((list) =>
      list.map((c) =>
        c.id === id ? { ...c, agenteId, agenteNombre, status: 'activa' as ConversationStatus } : c,
      ),
    );
  }

  enviarMensaje(conversacionId: string, texto: string, origen: 'agente' | 'bot'): void {
    const nuevoMensaje: Message = {
      id: `m${Date.now()}`,
      conversacionId,
      origen,
      texto,
      timestamp: new Date().toISOString(),
      leido: false,
    };
    this._conversations.update((list) =>
      list.map((c) =>
        c.id === conversacionId
          ? {
              ...c,
              mensajes: [...c.mensajes, nuevoMensaje],
              ultimoMensaje: texto,
              ultimoMensajeAt: nuevoMensaje.timestamp,
            }
          : c,
      ),
    );
  }

  /** Simula respuesta del cliente tras un delay (para la demo) */
  simularRespuestaCliente(conversacionId: string, texto: string, delayMs = 1500): void {
    setTimeout(() => {
      const mensaje: Message = {
        id: `m${Date.now()}`,
        conversacionId,
        origen: 'cliente',
        texto,
        timestamp: new Date().toISOString(),
        leido: false,
      };
      this._conversations.update((list) =>
        list.map((c) =>
          c.id === conversacionId
            ? {
                ...c,
                mensajes: [...c.mensajes, mensaje],
                ultimoMensaje: texto,
                ultimoMensajeAt: mensaje.timestamp,
                mensajesNoLeidos: c.mensajesNoLeidos + 1,
              }
            : c,
        ),
      );
    }, delayMs);
  }
}
