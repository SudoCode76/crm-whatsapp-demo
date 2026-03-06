import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  template: `
    <div class="auth-content-wrap">
      <div class="auth-content">
        <router-outlet />
      </div>
      <p class="auth-version">v1.0.0 · CobraBot</p>
    </div>
  `,
  styles: `
    :host {
      display: contents;
    }

    .auth-content-wrap {
      min-height: 100dvh;
      width: 100%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      /* no background here — global body gradient handles it */
    }

    .auth-content {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 420px;
      padding: 0 1rem;
    }

    .auth-version {
      position: absolute;
      bottom: 1.5rem;
      left: 0;
      width: 100%;
      text-align: center;
      z-index: 10;
      margin: 0;
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.05em;
      color: rgb(100 116 139 / 80%);
    }
  `,
})
export class AuthLayout {}
