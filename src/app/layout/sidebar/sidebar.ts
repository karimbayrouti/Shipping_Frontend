import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageService } from '@core/i18n/language.service';
import { APP_NAV } from '@core/navigation/nav.config';
import { BrandMark } from '@shared/ui/brand-mark/brand-mark';
import { ShellUiService } from '../shell/shell-ui.service';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, BrandMark],
  templateUrl: './sidebar.html',
  styles: ':host { display: contents; }',
})
export class Sidebar {
  protected readonly language = inject(LanguageService);
  protected readonly shellUi = inject(ShellUiService);
  protected readonly groups = APP_NAV;
  protected readonly companyName = computed(() =>
    this.language.language() === 'ar' ? 'مؤسسة الرماح للشحن' : 'El Ramah Shipping',
  );
  protected readonly appName = computed(() =>
    this.language.language() === 'ar' ? 'نظام إدارة الشحن' : 'Shipping Management',
  );
  protected label(ar: string, en: string): string {
    return this.language.language() === 'ar' ? ar : en;
  }
  protected closeDrawer(): void {
    this.shellUi.sidebarOpen.set(false);
  }
}
