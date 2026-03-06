import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  signal,
  computed,
  effect,
} from '@angular/core';
import { Router } from '@angular/router';
import { ClientsService } from '../../../core/services/clients.service';

@Component({
  selector: 'app-form-cliente',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class FormCliente {
  private svc = inject(ClientsService);
  private router = inject(Router);

  /** undefined = crear, string = editar */
  id = input<string>();

  existing = computed(() => (this.id() ? this.svc.getById(this.id()!) : undefined));
  isEdit = computed(() => !!this.id());

  nombre = signal('');
  telefono = signal('');
  email = signal('');
  empresa = signal('');
  nit = signal('');
  direccion = signal('');

  constructor() {
    // Pre-llenar formulario cuando se resuelva el id de edición
    effect(() => {
      const c = this.existing();
      if (c) {
        this.nombre.set(c.nombre);
        this.telefono.set(c.telefono);
        this.email.set(c.email ?? '');
        this.empresa.set(c.empresa ?? '');
        this.nit.set(c.nit ?? '');
        this.direccion.set(c.direccion ?? '');
      }
    });
  }

  guardar() {
    const data = {
      nombre: this.nombre(),
      telefono: this.telefono(),
      email: this.email() || undefined,
      empresa: this.empresa() || undefined,
      nit: this.nit() || undefined,
      direccion: this.direccion() || undefined,
      activo: true,
    };
    if (this.isEdit()) {
      this.svc.update(this.id()!, data);
    } else {
      this.svc.create(data);
    }
    this.router.navigate(['/clients']);
  }
}
