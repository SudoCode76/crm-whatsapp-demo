import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = signal('carlos@empresa.gt');
  password = signal('demo1234');
  error = signal('');
  loading = signal(false);

  onEmailInput(e: Event) {
    this.email.set((e.target as HTMLInputElement).value);
  }

  onPasswordInput(e: Event) {
    this.password.set((e.target as HTMLInputElement).value);
  }

  submit() {
    this.error.set('');
    this.loading.set(true);
    const ok = this.auth.login(this.email(), this.password());
    this.loading.set(false);
    if (ok) {
      this.router.navigate(['/reports/dashboard']);
    } else {
      this.error.set('Credenciales incorrectas. Intenta de nuevo.');
    }
  }
}
