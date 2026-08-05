import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '@core/i18n/language.service';
import { APP_NAV } from '@core/navigation/nav.config';

@Component({
  selector: 'app-coming-soon-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty-state">
      <div class="empty-state__icon">{{ item()?.icon }}</div>
      <h1 class="empty-state__title">{{ label() }}</h1>
      <p class="empty-state__hint">
        {{
          language.language() === 'ar'
            ? 'هذه الشاشة قيد النقل من النموذج الأولي.'
            : 'This prototype screen is being migrated.'
        }}
      </p>
    </div>
  `,
})
export class ComingSoonPage {
  protected readonly language = inject(LanguageService);
  private readonly route = inject(ActivatedRoute);
  protected readonly item = computed(() =>
    APP_NAV.flatMap((group) => group.items).find(
      (item) => item.key === this.route.snapshot.data['pageKey'],
    ),
  );
  protected readonly label = computed(() =>
    this.language.language() === 'ar' ? this.item()?.labelAr : this.item()?.labelEn,
  );
}
