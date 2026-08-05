import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { AR_TRANSLATIONS, EN_TRANSLATIONS, TranslationCatalog } from './index';

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

/**
 * Runtime language + direction switch (Charter AD-07/AD-08). Owns the `lang`
 * and `dir` attributes on <html>; all layout CSS uses logical properties, so
 * flipping `dir` mirrors the entire application.
 *
 * Direction is DERIVED from language (ar → rtl) rather than a separate
 * DirectionService — per the YAGNI amendment, split it out only if direction
 * ever needs to vary independently of language. This service is also the sole
 * runtime entry point to the centralized, namespaced translation catalogs.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly storage = inject(StorageService);

  private readonly state = signal<Language>(this.storage.get<Language>('language') ?? 'ar');

  /** The active language — read-only outside this service. */
  readonly language = this.state.asReadonly();

  /** Layout direction, derived from the language. */
  readonly direction = computed<Direction>(() => (this.state() === 'ar' ? 'rtl' : 'ltr'));

  /** The complete, namespaced catalog for the active language. */
  readonly translations = computed<TranslationCatalog>(() =>
    this.state() === 'ar' ? AR_TRANSLATIONS : EN_TRANSLATIONS,
  );

  constructor() {
    effect(() => {
      const lang = this.state();
      document.documentElement.lang = lang;
      document.documentElement.dir = this.direction();
      this.storage.set('language', lang);
    });
  }

  toggle(): void {
    this.state.update((l) => (l === 'en' ? 'ar' : 'en'));
  }

  set(language: Language): void {
    this.state.set(language);
  }
}
