import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { DOCUMENT, DecimalPipe } from '@angular/common';
import { LanguageService } from '@core/i18n/language.service';
import { TrucksViewTranslations } from '@core/i18n';
import { Dialog } from '@shared/ui/dialog/dialog';
import { Truck, VehicleRecordStatus, InsurancePolicyRecord } from '../../models/truck.model';
import {
  LoadingManifestDialog,
  WaybillBatchDialog,
  ReceiptBatchDialog,
  MANIFEST_FIXTURE,
  WAYBILL_BATCH_FIXTURE,
  RECEIPT_BATCH_FIXTURE,
} from '@shared/ui/print-dialogs';

type HistoryTab = 'history' | 'insurance' | 'timeline' | 'trips';
type PrintDialog = 'manifest' | 'waybills' | 'receipts' | null;

@Component({
  selector: 'app-vehicle-history-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Dialog, DecimalPipe, LoadingManifestDialog, WaybillBatchDialog, ReceiptBatchDialog],
  templateUrl: './vehicle-history-dialog.html',
  styleUrl: './vehicle-history-dialog.scss',
})
export class VehicleHistoryDialog implements AfterViewInit {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly language = inject(LanguageService);

  readonly truck = input.required<Truck>();
  readonly text = input.required<TrucksViewTranslations>();
  readonly closed = output<void>();
  readonly editRequested = output<Truck>();
  readonly insurancePolicyRequested = output<Truck>();
  readonly vehicleRecordRequested = output<Truck>();
  readonly tripDetailsRequested = output<string>();

  protected readonly activeTab = signal<HistoryTab>('history');
  protected readonly activePrintDialog = signal<PrintDialog>(null);

  protected readonly isAr = computed(() => this.language.language() === 'ar');

  protected readonly manifestData = MANIFEST_FIXTURE;
  protected readonly waybillBatchData = WAYBILL_BATCH_FIXTURE;
  protected readonly receiptBatchData = RECEIPT_BATCH_FIXTURE;

  ngAfterViewInit(): void {
    this.document.body.appendChild(this.host.nativeElement);
  }

  protected setTab(tab: HistoryTab): void {
    this.activeTab.set(tab);
  }

  protected openPrintDialog(dialog: PrintDialog): void {
    this.activePrintDialog.set(dialog);
  }

  protected closePrintDialog(): void {
    this.activePrintDialog.set(null);
  }

  protected onTripDetailsRequested(): void {
    const tripNo = this.truck().stats.currentTripNo;
    if (!tripNo) return;
    this.tripDetailsRequested.emit(tripNo);
  }

  protected recordStatusLabel(status: VehicleRecordStatus): string {
    const t = this.text();
    const map: Record<VehicleRecordStatus, string> = {
      done: t.historyStatusDone,
      scheduled: t.historyStatusScheduled,
      pending: t.historyStatusPending,
    };
    return map[status];
  }

  protected insuranceStatusLabel(state: InsurancePolicyRecord['state']): string {
    const t = this.text();
    const map: Record<InsurancePolicyRecord['state'], string> = {
      active: t.historyInsStatusActive,
      expiringSoon: t.historyInsStatusExpiringSoon,
      expired: t.historyInsStatusExpired,
    };
    return map[state];
  }

  protected insuranceTabLabel(): string {
    const count = this.truck().insuranceRecords.length;
    return `${this.text().historyTabInsurance} (${count})`;
  }

  protected dialogTitle(): string {
    return `🚚 ${this.truck().plateNumber}`;
  }

  protected dialogSubtitle(): string {
    const truck = this.truck();
    const model = `${truck.vehicleType} ${truck.vehicleModel}`;
    const driver = truck.driverName ? `🧑‍✈️ ${truck.driverName}` : '';
    return `${model}${driver ? ' · ' + driver : ''}`;
  }

  protected insuranceStatusValue(): string {
    const ins = this.truck().insurance;
    const t = this.text();
    if (!ins) return '—';
    if (ins.state === 'expired') return `${t.historyInsStatusExpired} · ${ins.nearestExpiry}`;
    return `${t.historyInsStatusActive} ${ins.nearestExpiry} · ${ins.count} 🛡`;
  }

  protected renewalBannerText(): string {
    const s = this.truck().stats;
    return this.isAr() ? s.renewalBannerText : s.renewalBannerTextEn;
  }

  /**
   * Converts Arabic unit suffixes to English equivalents when the UI is in EN mode.
   * ج.م → EGP, كم → km
   */
  protected fmtStat(value: string): string {
    if (this.isAr()) return value;
    return value.replace(/ج\.م/g, 'EGP').replace(/كم/g, 'km');
  }
}
