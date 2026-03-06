import { Component, ChangeDetectionStrategy, inject, input, output, signal } from '@angular/core';
import { UsersService } from '../../../core/services/users.service';
import { InboxService } from '../../../core/services/inbox.service';

@Component({
  selector: 'app-asignacion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="modal-backdrop" (click)="cerrar.emit()">
      <div class="modal glass" (click)="$event.stopPropagation()">
        <h2 class="modal-title">Asignar conversación</h2>
        <ul class="agente-list">
          @for (a of agentes(); track a.id) {
            <li>
              <button
                class="agente-btn"
                [class.agente-btn--selected]="agenteId() === a.id"
                (click)="agenteId.set(a.id)"
              >
                <span class="avatar">{{ a.avatar }}</span>
                <span class="agente-name">{{ a.nombre }}</span>
              </button>
            </li>
          }
        </ul>
        <div class="modal-footer">
          <button class="btn-cancel" (click)="cerrar.emit()">Cancelar</button>
          <button class="btn-primary" [disabled]="!agenteId()" (click)="confirmar()">
            Asignar
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: oklch(0% 0 0 / 50%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }
    .modal {
      border-radius: 1.25rem;
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      min-width: 320px;
    }
    .modal-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: oklch(92% 0.02 270);
      margin: 0;
    }
    .agente-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .agente-btn {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: oklch(100% 0 0 / 6%);
      border: 1px solid var(--glass-border);
      border-radius: 0.75rem;
      padding: 0.625rem 0.875rem;
      cursor: pointer;
      transition: all 0.15s;
    }
    .agente-btn--selected {
      background: var(--brand-primary);
      border-color: transparent;
    }
    .avatar {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: var(--brand-accent);
      color: white;
      font-size: 0.7rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .agente-name {
      font-size: 0.875rem;
      color: oklch(88% 0.02 270);
    }
    .modal-footer {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
    }
    .btn-cancel {
      background: none;
      border: 1px solid var(--glass-border);
      border-radius: 0.625rem;
      padding: 0.5rem 1rem;
      color: oklch(75% 0.04 270);
      cursor: pointer;
    }
    .btn-primary {
      background: var(--brand-primary);
      color: white;
      border: none;
      border-radius: 0.625rem;
      padding: 0.5rem 1.25rem;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
})
export class Asignacion {
  private usersService = inject(UsersService);
  private inbox = inject(InboxService);

  conversacionId = input.required<string>();
  cerrar = output<void>();
  asignado = output<string>();

  agentes = this.usersService.agentes;
  agenteId = signal('');

  confirmar() {
    const agente = this.usersService.getById(this.agenteId());
    if (!agente) return;
    this.inbox.asignar(this.conversacionId(), agente.id, agente.nombre);
    this.asignado.emit(agente.id);
    this.cerrar.emit();
  }
}
