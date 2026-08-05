import { Injectable, signal } from '@angular/core';

export type ToastTone = 'success' | 'danger';

export interface ToastState {
  readonly message: string;
  readonly tone: ToastTone;
}

/** Milliseconds a toast stays visible before auto-dismissing. */
const AUTO_DISMISS_MS = 3200;

/**
 * Generic, app-wide toast notifications. Any feature can call `show()` to
 * surface a transient confirmation banner (e.g. "تم صرف السلفة") without
 * owning its own alert UI — the presentational side lives once in
 * `shared/ui/toast` and reads this service's state.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly state = signal<ToastState | null>(null);
  private dismissTimer: ReturnType<typeof setTimeout> | null = null;

  readonly current = this.state.asReadonly();

  show(message: string, tone: ToastTone = 'success'): void {
    if (this.dismissTimer !== null) {
      clearTimeout(this.dismissTimer);
    }
    this.state.set({ message, tone });
    this.dismissTimer = setTimeout(() => this.dismiss(), AUTO_DISMISS_MS);
  }

  dismiss(): void {
    if (this.dismissTimer !== null) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }
    this.state.set(null);
  }
}
