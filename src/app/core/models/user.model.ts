export type UserRole = 'admin' | 'agente' | 'supervisor';

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  activo: boolean;
  avatar?: string;
  creadoEn: string;
  ultimoAcceso?: string;
}
