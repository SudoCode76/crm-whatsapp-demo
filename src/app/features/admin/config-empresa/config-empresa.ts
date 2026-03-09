import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { COMPANY } from '../../../data/company.data';

@Component({
  selector: 'app-config-empresa',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './config-empresa.html',
  styleUrl: './config-empresa.css',
})
export class ConfigEmpresa {
  nombre = signal(COMPANY.nombre);
  nit = signal(COMPANY.nit);
  email = signal(COMPANY.email);
  telefono = signal(COMPANY.telefono);
  direccion = signal(COMPANY.direccion);
  waNum = signal(COMPANY.whatsappNumero);
  saved = signal(false);

  guardar() {
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 3000);
  }
}
