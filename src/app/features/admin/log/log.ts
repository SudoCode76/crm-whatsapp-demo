import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ACTIVITY_LOGS } from '../../../data/activity-logs.data';

@Component({
  selector: 'app-log-actividad',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe],
  template: `
    <div class="page">
      <h1 class="page-title">Log de Actividad</h1>
      <div class="table-wrap glass">
        <table class="data-table">
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Detalle</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            @for (log of logs(); track log.id) {
              <tr>
                <td>{{ log.timestamp | date: 'dd/MM/yy HH:mm' }}</td>
                <td>{{ log.usuarioNombre }}</td>
                <td>
                  <span class="action-tag">{{ log.accion }}</span>
                </td>
                <td>{{ log.detalle }}</td>
                <td class="ip">{{ log.ip }}</td>
              </tr>
            }
          </tbody>
        </table>
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
    .table-wrap {
      border-radius: 1rem;
      overflow: hidden;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.8125rem;
    }
    .data-table th {
      text-align: left;
      padding: 0.75rem 1rem;
      color: oklch(65% 0.04 270);
      font-weight: 600;
      border-bottom: 1px solid var(--glass-border);
    }
    .data-table td {
      padding: 0.75rem 1rem;
      color: oklch(85% 0.02 270);
      border-bottom: 1px solid oklch(100% 0 0 / 5%);
    }
    .action-tag {
      background: oklch(65% 0.22 270 / 15%);
      color: var(--brand-primary);
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.15rem 0.5rem;
      border-radius: 0.25rem;
      font-family: monospace;
    }
    .ip {
      color: oklch(58% 0.02 270);
      font-size: 0.75rem;
      font-family: monospace;
    }
  `,
})
export class LogActividad {
  logs = signal(ACTIVITY_LOGS);
}
