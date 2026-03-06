import { User } from '../core/models/user.model';

export const USERS: User[] = [
  {
    id: 'u1',
    nombre: 'Carlos Méndez',
    email: 'carlos@empresa.gt',
    rol: 'admin',
    activo: true,
    avatar: 'CM',
    creadoEn: '2024-01-10T08:00:00Z',
  },
  {
    id: 'u2',
    nombre: 'María López',
    email: 'maria@empresa.gt',
    rol: 'agente',
    activo: true,
    avatar: 'ML',
    creadoEn: '2024-02-14T09:30:00Z',
  },
  {
    id: 'u3',
    nombre: 'Diego Ramírez',
    email: 'diego@empresa.gt',
    rol: 'agente',
    activo: true,
    avatar: 'DR',
    creadoEn: '2024-03-01T10:00:00Z',
  },
  {
    id: 'u4',
    nombre: 'Sofía Castillo',
    email: 'sofia@empresa.gt',
    rol: 'supervisor',
    activo: true,
    avatar: 'SC',
    creadoEn: '2024-03-15T11:00:00Z',
  },
  {
    id: 'u5',
    nombre: 'Luis Torres',
    email: 'luis@empresa.gt',
    rol: 'agente',
    activo: false,
    avatar: 'LT',
    creadoEn: '2024-04-01T08:00:00Z',
  },
];
