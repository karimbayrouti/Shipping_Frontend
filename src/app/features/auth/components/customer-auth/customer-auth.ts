import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '@core/i18n/language.service';
import { DEMO_PORTAL_EMAIL } from '../../login.data';

export type CustomerAuthView = 'login' | 'register' | 'forgot' | 'reset' | 'activate';

interface CustomerForm {
  email: string;
  password: string;
  confirm: string;
  name: string;
  phone: string;
}

/**
 * Customer-portal auth card (login / register / forgot / reset / activate) —
 * a 1:1 migration of the prototype's CustomerAuth (App.tsx). UI only: view
 * switching and the demo forgot-password flow are reproduced visually, but
 * submit actions are intentional no-ops until the auth phase.
 */
@Component({
  selector: 'app-customer-auth',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './customer-auth.html',
  styleUrl: './customer-auth.scss',
})
export class CustomerAuth {
  private readonly lang = inject(LanguageService);

  protected readonly t = computed(() => this.lang.translations().auth);

  protected readonly view = signal<CustomerAuthView>('login');
  protected readonly form = signal<CustomerForm>({
    // Prototype's pre-filled demo credentials.
    email: 'ahmed@example.com',
    password: '123456',
    confirm: '',
    name: '',
    phone: '',
  });
  /** Demo reset code; the sentinel '__none__' marks "no such account" (as in the prototype). */
  protected readonly resetCode = signal('');

  protected readonly mismatch = computed(() => {
    const f = this.form();
    return f.confirm !== '' && f.password !== f.confirm;
  });

  protected setField(key: keyof CustomerForm, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.form.update((f) => ({ ...f, [key]: value }));
  }

  protected submit(): void {
    const f = this.form();
    switch (this.view()) {
      case 'forgot':
        // Demo behavior from the prototype: only the seeded account "exists".
        if (f.email !== DEMO_PORTAL_EMAIL) {
          this.resetCode.set('__none__');
          return;
        }
        this.resetCode.set(String(Math.floor(100000 + Math.random() * 900000)));
        this.view.set('reset');
        break;
      case 'reset':
        if (f.password !== f.confirm) return;
        this.view.set('login');
        break;
      case 'register':
        if (f.password !== f.confirm) return;
        break;
      default:
        // login / activate: authentication is out of scope for the UI migration.
        break;
    }
  }
}
