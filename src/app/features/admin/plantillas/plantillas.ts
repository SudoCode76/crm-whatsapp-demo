import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { TEMPLATES } from '../../../data/templates.data';
import { Template } from '../../../core/models/template.model';

@Component({
  selector: 'app-plantillas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="page">
      <h1 class="page-title">Plantillas de Mensajes</h1>
      <div class="template-list">
        @for (t of templates(); track t.id) {
          <div
            class="tpl-card glass"
            [class.tpl-card--selected]="selected()?.id === t.id"
            (click)="selected.set(t)"
          >
            <div class="tpl-header">
              <span class="tpl-name">{{ t.nombre }}</span>
              <span class="badge badge--{{ t.status }}">{{ t.status }}</span>
            </div>
            <p class="tpl-preview">{{ t.contenido }}</p>
            <div class="tpl-meta">
              <span class="tag">{{ t.categoria }}</span>
              <span class="tag">{{ t.idioma }}</span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    /* .page layout handled globally in styles.css */
    .page-title {
      font-size: 1.375rem;
      font-weight: 700;
      color: oklch(95% 0.02 270);
      margin: 0;
    }
    .template-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1rem;
    }
    .tpl-card {
      border-radius: 1rem;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      cursor: pointer;
      transition: border-color 0.15s;
    }
    .tpl-card--selected {
      border-color: var(--brand-primary) !important;
    }
    .tpl-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }
    .tpl-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: oklch(88% 0.02 270);
      font-family: monospace;
    }
    .badge {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
    }
    .badge--aprobada {
      background: oklch(52% 0.18 150 / 20%);
      color: oklch(65% 0.18 150);
    }
    .badge--pendiente {
      background: oklch(72% 0.18 80 / 20%);
      color: oklch(72% 0.18 80);
    }
    .badge--rechazada {
      background: oklch(55% 0.22 25 / 20%);
      color: oklch(65% 0.22 25);
    }
    .tpl-preview {
      margin: 0;
      font-size: 0.8125rem;
      color: oklch(72% 0.02 270);
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .tpl-meta {
      display: flex;
      gap: 0.5rem;
    }
    .tag {
      background: oklch(100% 0 0 / 10%);
      border-radius: 9999px;
      padding: 0.15rem 0.625rem;
      font-size: 0.7rem;
      color: oklch(68% 0.04 270);
    }
  `,
})
export class Plantillas {
  templates = signal<Template[]>(TEMPLATES);
  selected = signal<Template | null>(null);
}
