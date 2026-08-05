import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Dialog } from '@shared/ui/dialog/dialog';
import { TripDepartureSummary } from '../../models/trip.model';
import { TripsViewTranslations } from '@core/i18n';
import { renderDialogToBody } from '../../utils/render-dialog-to-body.util';

@Component({
  selector: 'app-departure-summary-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Dialog],
  templateUrl: './departure-summary-dialog.html',
  styleUrl: './departure-summary-dialog.scss',
})
export class DepartureSummaryDialog {
  constructor() {
    renderDialogToBody();
  }

  readonly summary = input.required<TripDepartureSummary>();
  readonly text = input.required<TripsViewTranslations>();

  readonly closed = output<void>();
  readonly printManifestRequested = output<void>();
  readonly confirmDepartRequested = output<void>();

  protected readonly hasNotLoaded = computed(() => this.summary().notLoadedShipmentNos.length > 0);
  protected readonly advancePending = computed(() => !this.summary().trip.driverAdvanceIssued);
  protected readonly canDepart = computed(() => !this.hasNotLoaded() && !this.advancePending());
}
