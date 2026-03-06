import { Template } from '../core/models/template.model';

export const TEMPLATES: Template[] = [
  {
    id: 't1',
    nombre: 'bienvenida_nuevo_cliente',
    contenido:
      'Hola {{1}}, bienvenido a {{2}}. Estamos disponibles de lunes a viernes de 8am a 6pm. ¿En qué podemos ayudarte hoy?',
    categoria: 'utilidad',
    status: 'aprobada',
    idioma: 'es',
    creadoEn: '2024-01-15T10:00:00Z',
  },
  {
    id: 't2',
    nombre: 'recordatorio_pago',
    contenido:
      'Hola {{1}}, te recordamos que tienes un pago pendiente por Q{{2}}. Puedes pagarlo escaneando el siguiente QR o visitando nuestra tienda.',
    categoria: 'utilidad',
    status: 'aprobada',
    idioma: 'es',
    creadoEn: '2024-02-01T09:00:00Z',
  },
  {
    id: 't3',
    nombre: 'confirmacion_pago',
    contenido:
      '✅ ¡Pago recibido! Hola {{1}}, confirmamos el pago de Q{{2}} correspondiente a {{3}}. Gracias por tu preferencia.',
    categoria: 'utilidad',
    status: 'aprobada',
    idioma: 'es',
    creadoEn: '2024-02-01T09:30:00Z',
  },
  {
    id: 't4',
    nombre: 'promo_mensual',
    contenido:
      '🎉 ¡Hola {{1}}! Este mes tenemos descuentos especiales para clientes frecuentes. ¿Te interesa conocer nuestras ofertas?',
    categoria: 'marketing',
    status: 'aprobada',
    idioma: 'es',
    creadoEn: '2024-03-01T08:00:00Z',
  },
  {
    id: 't5',
    nombre: 'codigo_verificacion',
    contenido:
      'Tu código de verificación para {{1}} es: {{2}}. Válido por 10 minutos. No lo compartas con nadie.',
    categoria: 'autenticacion',
    status: 'aprobada',
    idioma: 'es',
    creadoEn: '2024-03-10T12:00:00Z',
  },
  {
    id: 't6',
    nombre: 'encuesta_satisfaccion',
    contenido:
      'Hola {{1}}, ¿cómo calificarías tu experiencia con nosotros? Responde del 1 al 5. Tu opinión nos ayuda a mejorar.',
    categoria: 'utilidad',
    status: 'pendiente',
    idioma: 'es',
    creadoEn: '2025-03-01T10:00:00Z',
  },
];
