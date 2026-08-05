import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * 403 — the target of permission guards (Phase 3). Routable today at
 * /forbidden so the route contract exists before the guards do.
 */
@Component({
  selector: 'app-forbidden-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <main class="error-page">
      <p class="error-page__code">403</p>
      <h1 class="error-page__title">Access denied</h1>
      <p class="error-page__text">You do not have permission to view this page.</p>
      <a routerLink="/">Back to home</a>
    </main>
  `,
  styleUrl: './error-page.scss',
})
export class ForbiddenPage {}
