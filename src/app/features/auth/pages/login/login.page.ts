import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '@core/i18n/language.service';
import { StorageService } from '@core/storage/storage.service';
import { BrandMark } from '@shared/ui/brand-mark/brand-mark';
import { CustomerAuth } from '../../components/customer-auth/customer-auth';
import {
  APP_VERSION,
  BRAND_FEATURES,
  COMPANY,
  LoginRole,
  ROLES,
  RoleKey,
  WAREHOUSES,
} from '../../login.data';

/**
 * Login screen — a 1:1 migration of the prototype's LoginScreen (App.tsx):
 * brand panel on the start side, staff/customer form panel on the end side.
 * UI only by design (Charter/migration brief): no authentication, no guards,
 * no API — the sign-in buttons are intentional no-ops until the auth phase.
 */
@Component({
  selector: 'app-login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrandMark, CustomerAuth],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  protected readonly lang = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly storage = inject(StorageService);

  protected readonly t = computed(() => this.lang.translations().auth);
  protected readonly rtl = computed(() => this.lang.language() === 'ar');

  protected readonly mode = signal<'staff' | 'customer'>('staff');
  protected readonly role = signal<RoleKey>('administrator');
  protected readonly remember = signal(true);
  protected readonly warehouseId = signal(1);

  protected readonly selectedRole = computed(
    () => ROLES.find((r) => r.key === this.role()) as LoginRole,
  );

  /**
   * The username field mirrors the prototype's uncontrolled `defaultValue`:
   * verified in the running prototype, the field keeps the initial
   * (administrator) demo name and does NOT follow role switching.
   */
  protected readonly initialUser = ROLES[0]?.user ?? '';

  protected readonly company = COMPANY;
  protected readonly roles = ROLES;
  protected readonly warehouses = WAREHOUSES;
  protected readonly features = BRAND_FEATURES;
  protected readonly version = APP_VERSION;
  protected readonly year = new Date().getFullYear();

  protected onWarehouseChange(event: Event): void {
    this.warehouseId.set(Number((event.target as HTMLSelectElement).value));
  }

  protected onRememberChange(event: Event): void {
    this.remember.set((event.target as HTMLInputElement).checked);
  }

  protected signIn(): void {
    const selected = this.selectedRole();
    this.storage.set('portal-session', { role: selected.key, user: selected.user });
    const landingPage: Record<RoleKey, string> = {
      administrator: '/portal/dashboard',
      operations: '/portal/trips',
      warehouse: '/portal/shipments',
      driver: '/portal/driver',
    };
    void this.router.navigateByUrl(landingPage[selected.key]);
  }
}
