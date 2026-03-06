import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { PaymentsService } from '../../../core/services/payments.service';

@Component({
  selector: 'app-comparativo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="page">
      <h1 class="page-title">Comparativo de períodos</h1>
      <div class="compare-grid">
        <div class="period-card glass">
          <h2 class="period-title">Período A</h2>
          <div class="field">
            <label>Desde</label
            ><input
              type="date"
              class="field-input"
              [value]="desdeA()"
              (input)="desdeA.set($any($event.target).value)"
            />
          </div>
          <div class="field">
            <label>Hasta</label
            ><input
              type="date"
              class="field-input"
              [value]="hastaA()"
              (input)="hastaA.set($any($event.target).value)"
            />
          </div>
          <div class="result">
            <span class="result-label">Total</span
            ><span class="result-value">Q {{ montoA().toFixed(2) }}</span>
          </div>
          <div class="result">
            <span class="result-label">Cobros</span><span class="result-value">{{ cantA() }}</span>
          </div>
        </div>
        <div class="vs-divider">VS</div>
        <div class="period-card glass">
          <h2 class="period-title">Período B</h2>
          <div class="field">
            <label>Desde</label
            ><input
              type="date"
              class="field-input"
              [value]="desdeB()"
              (input)="desdeB.set($any($event.target).value)"
            />
          </div>
          <div class="field">
            <label>Hasta</label
            ><input
              type="date"
              class="field-input"
              [value]="hastaB()"
              (input)="hastaB.set($any($event.target).value)"
            />
          </div>
          <div class="result">
            <span class="result-label">Total</span
            ><span class="result-value">Q {{ montoB().toFixed(2) }}</span>
          </div>
          <div class="result">
            <span class="result-label">Cobros</span><span class="result-value">{{ cantB() }}</span>
          </div>
        </div>
      </div>
      <div class="delta glass">
        <span class="delta-label">Diferencia</span>
        <span
          class="delta-value"
          [class.delta--pos]="delta() >= 0"
          [class.delta--neg]="delta() < 0"
        >
          {{ delta() >= 0 ? '+' : '' }}Q {{ delta().toFixed(2) }}
        </span>
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
    .compare-grid {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      flex-wrap: wrap;
    }
    .period-card {
      border-radius: 1rem;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      flex: 1;
      min-width: 240px;
    }
    .period-title {
      font-size: 0.9375rem;
      font-weight: 700;
      color: oklch(85% 0.04 270);
      margin: 0;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .field label {
      font-size: 0.75rem;
      color: oklch(68% 0.04 270);
    }
    .field-input {
      background: oklch(100% 0 0 / 8%);
      border: 1px solid var(--glass-border);
      border-radius: 0.5rem;
      padding: 0.5rem 0.75rem;
      color: oklch(93% 0.01 270);
      font-size: 0.875rem;
      outline: none;
    }
    .result {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.5rem;
      border-top: 1px solid var(--glass-border);
    }
    .result-label {
      font-size: 0.8125rem;
      color: oklch(68% 0.04 270);
    }
    .result-value {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--brand-accent);
    }
    .vs-divider {
      font-size: 1.5rem;
      font-weight: 900;
      color: oklch(55% 0.04 270);
      align-self: center;
      padding: 0 0.5rem;
    }
    .delta {
      border-radius: 1rem;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 400px;
    }
    .delta-label {
      font-size: 0.9rem;
      color: oklch(70% 0.04 270);
    }
    .delta-value {
      font-size: 1.5rem;
      font-weight: 800;
    }
    .delta--pos {
      color: oklch(65% 0.18 150);
    }
    .delta--neg {
      color: oklch(65% 0.22 25);
    }
  `,
})
export class Comparativo {
  private svc = inject(PaymentsService);

  desdeA = signal('2025-03-01');
  hastaA = signal('2025-03-15');
  desdeB = signal('2025-02-01');
  hastaB = signal('2025-02-15');

  private filtrar = (desde: string, hasta: string) =>
    this.svc.pagados().filter((p) => {
      const f = p.pagadoEn?.split('T')[0] ?? '';
      return f >= desde && f <= hasta;
    });

  pagosA = computed(() => this.filtrar(this.desdeA(), this.hastaA()));
  pagosB = computed(() => this.filtrar(this.desdeB(), this.hastaB()));
  montoA = computed(() => this.pagosA().reduce((s, p) => s + p.monto, 0));
  montoB = computed(() => this.pagosB().reduce((s, p) => s + p.monto, 0));
  cantA = computed(() => this.pagosA().length);
  cantB = computed(() => this.pagosB().length);
  delta = computed(() => this.montoA() - this.montoB());
}
