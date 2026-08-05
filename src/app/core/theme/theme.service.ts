import { effect, inject, Injectable, signal } from '@angular/core';
import { StorageService } from '../storage/storage.service';

export type Theme = 'light' | 'dark';

/**
 * Runtime theme switch (Charter AD-22). The design system is themed entirely
 * through CSS custom properties keyed off `data-theme` on <html> — this
 * service owns that attribute and persists the choice.
 *
 * Lives in CORE (not layout) so features can *read* the current theme; only
 * layout renders the toggle control.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storage = inject(StorageService);

  private readonly state = signal<Theme>(this.storage.get<Theme>('theme') ?? 'light');

  /** The active theme — read-only outside this service. */
  readonly theme = this.state.asReadonly();

  constructor() {
    // Signals drive the DOM attribute; runs on init and on every change.
    effect(() => {
      const theme = this.state();
      document.documentElement.setAttribute('data-theme', theme);
      this.storage.set('theme', theme);
    });
  }

  toggle(): void {
    this.state.update((t) => (t === 'light' ? 'dark' : 'light'));
  }

  set(theme: Theme): void {
    this.state.set(theme);
  }
}
