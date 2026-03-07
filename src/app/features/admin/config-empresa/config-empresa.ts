import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { COMPANY } from '../../../data/company.data';

@Component({
  selector: 'app-config-empresa',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="page">
      <h1 class="page-title">Configuración de la Empresa</h1>
      <form class="form-card glass" (ngSubmit)="guardar()">
        <div class="field">
          <label>Nombre</label
          ><input type="text" [value]="nombre()" (input)="nombre.set($any($event.target).value)" />
        </div>
        <div class="field">
          <label>NIT</label
          ><input type="text" [value]="nit()" (input)="nit.set($any($event.target).value)" />
        </div>
        <div class="field">
          <label>Dirección</label
          ><input
            type="text"
            [value]="direccion()"
            (input)="direccion.set($any($event.target).value)"
          />
        </div>
        <div class="field">
          <label>Teléfono</label
          ><input
            type="text"
            [value]="telefono()"
            (input)="telefono.set($any($event.target).value)"
          />
        </div>
        <div class="field">
          <label>Email</label
          ><input type="email" [value]="email()" (input)="email.set($any($event.target).value)" />
        </div>
        <div class="field">
          <label>Número WhatsApp</label
          ><input type="text" [value]="waNum()" (input)="waNum.set($any($event.target).value)" />
        </div>
        @if (saved()) {
          <p class="saved-msg">✓ Cambios guardados (demo).</p>
        }
        <button type="submit" class="btn-primary">Guardar cambios</button>
      </form>
    </div>
  `,
  styles: `
    /* .page layout handled globally in styles.css */
    .page-title {
      font-size: 1.375rem;
      font-weight: 700;
      color: oklch(95% 0.02 270);
      margin: 0 0 1.5rem;
    }
    .form-card {
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 560px;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }
    .field label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: oklch(75% 0.04 270);
    }
    .field input {
      background: oklch(100% 0 0 / 8%);
      border: 1px solid var(--glass-border);
      border-radius: 0.625rem;
      padding: 0.625rem 0.875rem;
      color: oklch(93% 0.01 270);
      font-size: 0.9rem;
      outline: none;
    }
    .field input:focus {
      border-color: var(--brand-primary);
    }
    .saved-msg {
      color: oklch(65% 0.18 150);
      font-size: 0.875rem;
      margin: 0;
    }
    .btn-primary {
      background: var(--brand-primary);
      color: white;
      border: none;
      border-radius: 0.75rem;
      padding: 0.75rem;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 0.5rem;
    }
  `,
})
export class ConfigEmpresa {
  nombre = signal(COMPANY.nombre);
  nit = signal(COMPANY.nit);
  direccion = signal(COMPANY.direccion);
  telefono = signal(COMPANY.telefono);
  email = signal(COMPANY.email);
  waNum = signal(COMPANY.whatsappNumero);
  saved = signal(false);

  guardar() {
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 3000);
  }
}
