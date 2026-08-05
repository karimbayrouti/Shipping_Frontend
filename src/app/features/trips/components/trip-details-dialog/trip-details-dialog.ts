import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { Dialog } from '@shared/ui/dialog/dialog';
import { Trip, TripShipmentRow } from '../../models/trip.model';
import { TripsViewTranslations } from '@core/i18n';
import { renderDialogToBody } from '../../utils/render-dialog-to-body.util';

type TripDetailsTab = 'shipments' | 'fieldOps' | 'collections' | 'expenses' | 'log';

@Component({
  selector: 'app-trip-details-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Dialog],
  templateUrl: './trip-details-dialog.html',
  styleUrl: './trip-details-dialog.scss',
})
export class TripDetailsDialog {
  constructor() {
    renderDialogToBody();
  }

  readonly trip = input.required<Trip>();
  readonly rows = input.required<readonly TripShipmentRow[]>();
  readonly text = input.required<TripsViewTranslations>();

  readonly closed = output<void>();
  readonly shipmentClicked = output<number>();
  readonly confirmArrivalRequested = output<void>();
  readonly settleRequested = output<void>();
  readonly printManifestRequested = output<void>();
  readonly printWaybillRequested = output<void>();
  readonly printAllWaybillsRequested = output<void>();
  readonly printSelectedWaybillsRequested = output<readonly number[]>();
  readonly printReceiptsRequested = output<void>();
  readonly printAdvanceReceiptRequested = output<void>();

  protected readonly activeTab = signal<TripDetailsTab>('shipments');
  protected readonly selectedForPrint = signal<ReadonlySet<number>>(new Set());

  protected readonly outboundRows = computed(() =>
    this.rows().filter((row) => row.direction === 'outbound'),
  );
  protected readonly inboundRows = computed(() =>
    this.rows().filter((row) => row.direction !== 'outbound'),
  );

  protected readonly selectedCount = computed(() => this.selectedForPrint().size);

  protected setTab(tab: TripDetailsTab): void {
    this.activeTab.set(tab);
  }

  protected toggleSelected(id: number, checked: boolean): void {
    this.selectedForPrint.update((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  protected requestSelectedWaybills(): void {
    this.printSelectedWaybillsRequested.emit([...this.selectedForPrint()]);
  }

  protected statusLabel(status: Trip['status']): string {
    const t = this.text();
    const map: Record<Trip['status'], string> = {
      planned: t.statusPlanned,
      inProgress: t.statusInProgress,
      arrived: t.statusArrived,
      completed: t.statusCompleted,
      closed: t.statusClosed,
      cancelled: t.statusCancelled,
    };
    return map[status];
  }

  protected arrivalPerformanceLabel(): string {
    const perf = this.trip().fieldOps?.arrivalPerformance ?? 'unknown';
    const t = this.text();
    return perf === 'onTime'
      ? t.fieldOpsOnTime
      : perf === 'late'
        ? t.fieldOpsLate
        : t.fieldOpsUnknown;
  }

  protected showConfirmArrival(): boolean {
    return this.trip().status === 'inProgress';
  }

  protected showSettle(): boolean {
    return this.trip().status === 'completed';
  }
}
