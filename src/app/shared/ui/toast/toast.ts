import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '@core/toast/toast.service';

@Component({
  selector: 'ui-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast.html',
})
export class Toast {
  private readonly toast = inject(ToastService);

  readonly current = this.toast.current;

  dismiss(): void {
    this.toast.dismiss();
  }
}
