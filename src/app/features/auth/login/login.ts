import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  private route = inject(ActivatedRoute);

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
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      this.router.navigateByUrl(returnUrl ?? '/inicio');
    } else {
      this.error.set('Credenciales incorrectas. Intenta de nuevo.');
    }
  }
}
