import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

interface DaySchedule {
  key: string;
  label: string;
  enabled: boolean;
  inicio: string;
  fin: string;
}

interface QuickReply {
  key: string;
  titulo: string;
  variables: string[];
  texto: string;
}

@Component({
  selector: 'app-chatbot-config',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './config.html',
  styleUrl: './config.css',
})
export class ChatbotConfig {
  /* ── Identidad */
  nombreBot = signal('CobraBot');
  personalidad = signal<'formal' | 'amigable' | 'profesional'>('amigable');
  mensajeBienvenida = signal(
    '¡Hola! Soy CobraBot, el asistente virtual de tu empresa. ¿En qué te puedo ayudar hoy?',
  );
  mensajeFueraHorario = signal(
    'Gracias por contactarnos. En este momento estamos fuera del horario de atención. Te responderemos en cuanto estemos disponibles.',
  );

  /* ── Horario */
  horarioActivo = signal(true);

  dias = signal<DaySchedule[]>([
    { key: 'lun', label: 'Lunes', enabled: true, inicio: '08:00', fin: '18:00' },
    { key: 'mar', label: 'Martes', enabled: true, inicio: '08:00', fin: '18:00' },
    { key: 'mie', label: 'Miércoles', enabled: true, inicio: '08:00', fin: '18:00' },
    { key: 'jue', label: 'Jueves', enabled: true, inicio: '08:00', fin: '18:00' },
    { key: 'vie', label: 'Viernes', enabled: true, inicio: '08:00', fin: '18:00' },
    { key: 'sab', label: 'Sábado', enabled: false, inicio: '09:00', fin: '13:00' },
    { key: 'dom', label: 'Domingo', enabled: false, inicio: '09:00', fin: '13:00' },
  ]);

  /* ── Comportamiento cobros */
  recordatorioAutomatico = signal(true);
  enviarQrAutomatico = signal(true);
  confirmarPago = signal(true);
  reenvioRecordatorio = signal<'1d' | '3d' | '7d'>('3d');

  /* ── Frases rápidas */
  respuestasRapidas = signal<QuickReply[]>([
    {
      key: 'deuda',
      titulo: 'Deuda Consultada',
      variables: ['{nombre}', '{monto}', '{fecha_vencimiento}'],
      texto: 'Hola {nombre}, tu deuda pendiente es de Bs. {monto} con vencimiento el {fecha_vencimiento}.',
    },
    {
      key: 'pago',
      titulo: 'Pago Confirmado',
      variables: ['{nombre}', '{monto}', '{referencia}'],
      texto: '¡Perfecto {nombre}! Hemos recibido tu pago de Bs. {monto}. Referencia: {referencia}.',
    },
    {
      key: 'qr',
      titulo: 'QR Enviado',
      variables: ['{nombre}', '{monto}', '{expiracion}'],
      texto: 'Te enviamos un código QR de pago por Bs. {monto}. Este código expira el {expiracion}.',
    },
  ]);

  saved = signal(false);

  toggleDia(key: string) {
    this.dias.update((list) =>
      list.map((d) => (d.key === key ? { ...d, enabled: !d.enabled } : d)),
    );
  }

  updateDiaHora(key: string, field: 'inicio' | 'fin', value: string) {
    this.dias.update((list) =>
      list.map((d) => (d.key === key ? { ...d, [field]: value } : d)),
    );
  }

  updateRespuesta(key: string, texto: string) {
    this.respuestasRapidas.update((list) =>
      list.map((r) => (r.key === key ? { ...r, texto } : r)),
    );
  }

  guardar() {
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 3000);
  }
}
