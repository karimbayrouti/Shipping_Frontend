import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { LanguageService } from '@core/i18n/language.service';
import { APP_NAV } from '@core/navigation/nav.config';
import { StorageService } from '@core/storage/storage.service';
import { ThemeService } from '@core/theme/theme.service';
import { ShellUiService } from '../shell/shell-ui.service';

interface PortalSession {
  readonly role: string;
  readonly user: string;
}

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnDestroy {
  protected readonly theme = inject(ThemeService);
  protected readonly language = inject(LanguageService);
  protected readonly shellUi = inject(ShellUiService);
  private readonly router = inject(Router);
  private readonly storage = inject(StorageService);
  private readonly navigation = toSignal(this.router.events, { initialValue: null });
  protected readonly query = signal('');
  protected readonly now = signal(new Date());
  private readonly clockTimer = window.setInterval(() => this.now.set(new Date()), 30_000);
  protected readonly session = this.storage.get<PortalSession>('portal-session') ?? {
    role: 'administrator',
    user: 'محمود عبد الحليم',
  };
  protected readonly items = APP_NAV.flatMap((group) => group.items);
  protected readonly currentItem = computed(() => {
    this.navigation();
    return this.items.find((item) => this.router.url.startsWith(item.route));
  });
  protected readonly currentGroup = computed(() => {
    const item = this.currentItem();
    return item ? APP_NAV.find((group) => group.items.includes(item)) : undefined;
  });
  protected readonly searchResults = computed(() => {
    const query = this.query().trim().toLocaleLowerCase(this.language.language());
    return query
      ? this.items.filter((item) =>
          this.label(item.labelAr, item.labelEn)
            .toLocaleLowerCase(this.language.language())
            .includes(query),
        )
      : [];
  });

  protected label(ar: string, en: string): string {
    return this.language.language() === 'ar' ? ar : en;
  }
  protected toggleMenu(menu: 'quick' | 'notifications' | 'profile'): void {
    this.shellUi.headerMenu.update((current) => (current === menu ? null : menu));
  }
  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
  protected dateTime(): string {
    const locale = this.language.language() === 'ar' ? 'ar-EG' : 'en-GB';
    const date = this.now().toLocaleDateString(locale, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
    const time = this.now().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    return `${date} · ${time}`;
  }
  protected signOut(): void {
    this.storage.remove('portal-session');
    void this.router.navigate(['/portal']);
  }
  ngOnDestroy(): void {
    window.clearInterval(this.clockTimer);
  }
}
