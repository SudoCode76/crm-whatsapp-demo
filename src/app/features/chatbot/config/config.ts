import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-chatbot-config',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './config.html',
  styleUrl: './config.css',
})
export class ChatbotConfig {
  tono = signal<'formal' | 'amigable' | 'neutro'>('amigable');
  saludo = signal('¡Hola! Soy el asistente virtual de Empresa GT. ¿En qué te puedo ayudar hoy?');
  activo = signal(true);

  setTono(t: 'formal' | 'amigable' | 'neutro') {
    this.tono.set(t);
  }
  guardar() {
    /* En demo: no hace nada persistente */
  }
}
