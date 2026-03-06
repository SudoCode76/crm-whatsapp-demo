import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { PaymentsService } from '../../../core/services/payments.service';

@Component({
  selector: 'app-pagados-vs-no',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="page">
      <h1 class="page-title">Pagados vs No pagados</h1>
      <div class="chart-row">
        <div class="chart-bar glass">
          <div class="bar bar--green" [style.height.%]="pctPagados()"></div>
          <span class="bar-label">Pagados<br />{{ cantPagados() }}</span>
        </div>
        <div class="chart-bar glass">
          <div class="bar bar--yellow" [style.height.%]="pctPendientes()"></div>
          <span class="bar-label">Pendientes<br />{{ cantPendientes() }}</span>
        </div>
        <div class="chart-bar glass">
          <div class="bar bar--gray" [style.height.%]="pctExpirados()"></div>
          <span class="bar-label">Expirados<br />{{ cantExpirados() }}</span>
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
    .chart-row {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
      height: 280px;
    }
    .chart-bar {
      flex: 1;
      border-radius: 1rem;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      gap: 0.5rem;
    }
    .bar {
      width: 60%;
      border-radius: 0.5rem 0.5rem 0 0;
      min-height: 4px;
      transition: height 0.5s;
    }
    .bar--green {
      background: oklch(52% 0.18 150);
    }
    .bar--yellow {
      background: oklch(72% 0.18 80);
    }
    .bar--gray {
      background: oklch(55% 0.04 270);
    }
    .bar-label {
      font-size: 0.75rem;
      text-align: center;
      color: oklch(75% 0.04 270);
    }
  `,
})
export class PagadosVsNo {
  private svc = inject(PaymentsService);
  cantPagados = computed(() => this.svc.pagados().length);
  cantPendientes = computed(() => this.svc.pendientes().length);
  cantExpirados = computed(() => this.svc.expirados().length);
  total = computed(() => this.cantPagados() + this.cantPendientes() + this.cantExpirados());
  pctPagados = computed(() => (this.total() ? (this.cantPagados() / this.total()) * 100 : 0));
  pctPendientes = computed(() => (this.total() ? (this.cantPendientes() / this.total()) * 100 : 0));
  pctExpirados = computed(() => (this.total() ? (this.cantExpirados() / this.total()) * 100 : 0));
}
