import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * 404 — rendered by the wildcard route (app.routes.ts).
 * Deliberately dependency-free: it must work even when everything else fails.
 */
@Component({
  selector: 'app-not-found-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <main class="error-page">
      <p class="error-page__code">404</p>
      <h1 class="error-page__title">Page not found</h1>
      <p class="error-page__text">The page you are looking for does not exist or was moved.</p>
      <a routerLink="/">Back to home</a>
    </main>
  `,
  styleUrl: './error-page.scss',
})
export class NotFoundPage {}
