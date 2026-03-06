import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';
import { USERS } from '../../data/users.data';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser = signal<User | null>(null);
  private _isAuthenticated = signal(false);

  currentUser = this._currentUser.asReadonly();
  isAuthenticated = this._isAuthenticated.asReadonly();

  isAdmin = computed(() => this._currentUser()?.rol === 'admin');
  isSupervisor = computed(
    () => this._currentUser()?.rol === 'supervisor' || this._currentUser()?.rol === 'admin',
  );

  login(email: string, _password: string): boolean {
    const user = USERS.find((u) => u.email === email && u.activo);
    if (user) {
      this._currentUser.set(user);
      this._isAuthenticated.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
  }
}
