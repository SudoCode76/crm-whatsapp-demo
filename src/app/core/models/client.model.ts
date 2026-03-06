export interface Client {
  id: string;
  nombre: string;
  telefono: string;
  email?: string;
  empresa?: string;
  nit?: string;
  direccion?: string;
  notas?: string;
  creadoEn: string;
  activo: boolean;
}
