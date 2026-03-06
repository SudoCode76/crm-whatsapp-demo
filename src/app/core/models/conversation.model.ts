export type ConversationStatus = 'activa' | 'espera' | 'cerrada' | 'bot';

export interface Message {
  id: string;
  conversacionId: string;
  origen: 'cliente' | 'agente' | 'bot';
  texto: string;
  timestamp: string;
  leido: boolean;
}

export interface Conversation {
  id: string;
  clienteId: string;
  clienteNombre: string;
  clienteTelefono: string;
  status: ConversationStatus;
  agenteId?: string;
  agenteNombre?: string;
  ultimoMensaje: string;
  ultimoMensajeAt: string;
  mensajesNoLeidos: number;
  mensajes: Message[];
}
