export type TemplateStatus = 'aprobada' | 'pendiente' | 'rechazada';
export type TemplateCategory = 'utilidad' | 'marketing' | 'autenticacion';

export interface Template {
  id: string;
  nombre: string;
  contenido: string;
  categoria: TemplateCategory;
  status: TemplateStatus;
  idioma: string;
  creadoEn: string;
}
