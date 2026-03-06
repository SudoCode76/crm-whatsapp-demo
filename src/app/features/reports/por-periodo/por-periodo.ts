import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { PaymentsService } from '../../../core/services/payments.service';

@Component({
  selector: 'app-por-periodo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="page">
      <h1 class="page-title">Reporte por período</h1>
      <div class="filters glass">
        <div class="field">
          <label>Desde</label
          ><input
            type="date"
            class="field-input"
            [value]="desde()"
            (input)="desde.set($any($event.target).value)"
          />
        </div>
        <div class="field">
          <label>Hasta</label
          ><input
            type="date"
            class="field-input"
            [value]="hasta()"
            (input)="hasta.set($any($event.target).value)"
          />
        </div>
      </div>
      <div class="kpi-row">
        <div class="kpi glass">
          <span class="kpi-label">Total cobrado</span
          ><span class="kpi-value">Q {{ totalMonto().toFixed(2) }}</span>
        </div>
        <div class="kpi glass">
          <span class="kpi-label">Cantidad de cobros</span
          ><span class="kpi-value">{{ total() }}</span>
        </div>
      </div>
    </div>
  `,
  styles: `
    .page {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .page-title {
      font-size: 1.375rem;
      font-weight: 700;
      color: oklch(95% 0.02 270);
      margin: 0;
    }
    .filters {
      border-radius: 1rem;
      padding: 1.25rem;
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }
    .field label {
      font-size: 0.8125rem;
      color: oklch(70% 0.04 270);
    }
    .field-input {
      background: oklch(100% 0 0 / 8%);
      border: 1px solid var(--glass-border);
      border-radius: 0.625rem;
      padding: 0.5rem 0.75rem;
      color: oklch(93% 0.01 270);
      font-size: 0.875rem;
      outline: none;
    }
    .kpi-row {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .kpi {
      border-radius: 1rem;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      min-width: 200px;
    }
    .kpi-label {
      font-size: 0.8125rem;
      color: oklch(70% 0.04 270);
    }
    .kpi-value {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--brand-accent);
    }
  `,
})
export class PorPeriodo {
  private svc = inject(PaymentsService);

  hoy = new Date().toISOString().split('T')[0];
  desde = signal(this.hoy);
  hasta = signal(this.hoy);

  filtrados = computed(() =>
    this.svc.pagados().filter((p) => {
      const f = p.pagadoEn?.split('T')[0] ?? '';
      return f >= this.desde() && f <= this.hasta();
    }),
  );
  total = computed(() => this.filtrados().length);
  totalMonto = computed(() => this.filtrados().reduce((s, p) => s + p.monto, 0));
}
