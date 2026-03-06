export type PaymentStatus = 'pagado' | 'pendiente' | 'expirado';

export interface Payment {
  id: string;
  clienteId: string;
  clienteNombre: string;
  monto: number;
  moneda: string;
  descripcion: string;
  status: PaymentStatus;
  qrCode: string;
  creadoEn: string;
  pagadoEn?: string;
  expiraEn: string;
}
