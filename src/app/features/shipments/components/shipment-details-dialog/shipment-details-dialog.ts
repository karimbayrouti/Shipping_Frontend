import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ShipmentsViewTranslations } from '@core/i18n';
import { LanguageService } from '@core/i18n/language.service';
import { Dialog } from '@shared/ui/dialog/dialog';
import {
  ShipmentCollectionStatus,
  ShipmentCurrency,
  ShipmentDirection,
  ShipmentGoodsCategory,
  ShipmentPackageType,
  ShipmentStatus,
  ShipmentTransportMode,
} from '../../models/shipment.model';
import {
  ShipmentDetails,
  ShipmentDocChainKind,
  ShipmentDocChainNode,
  ShipmentDocumentKind,
  ShipmentPaymentMethod,
  ShipmentReceiptVoucher,
  ShipmentStageKey,
} from '../../models/shipment-details.model';
import { resolveCurrencySymbol } from '../../utils/currency.util';

/** Footer action-button layout, keyed by the status groupings the UI distinguishes. */
type DetailsActionsLayout = 'draft' | 'pendingDispatch' | 'inTransit' | 'closed' | 'default';

interface PackageLineTotals {
  readonly packages: number;
  readonly pieces: number;
  readonly net: number;
  readonly gross: number;
  readonly delivered: number;
  readonly shortage: number;
}

/** Document chain nodes disabled per shipment status; unlisted kinds stay enabled. */
const DOC_CHAIN_DISABLED_KINDS: Record<ShipmentStatus, ReadonlySet<ShipmentDocChainKind>> = {
  draft: new Set<ShipmentDocChainKind>([
    'waybill',
    'trip',
    'truck',
    'driver',
    'deliveryReceipt',
    'invoice',
    'paymentReceipt',
    'settlement',
  ]),
  ready: new Set<ShipmentDocChainKind>([
    'waybill',
    'trip',
    'truck',
    'driver',
    'deliveryReceipt',
    'invoice',
    'paymentReceipt',
    'settlement',
  ]),
  assigned: new Set<ShipmentDocChainKind>([
    'deliveryReceipt',
    'invoice',
    'paymentReceipt',
    'settlement',
  ]),
  loaded: new Set<ShipmentDocChainKind>([
    'deliveryReceipt',
    'invoice',
    'paymentReceipt',
    'settlement',
  ]),
  inTransit: new Set<ShipmentDocChainKind>(['deliveryReceipt', 'invoice', 'settlement']),
  delivered: new Set<ShipmentDocChainKind>(),
  returned: new Set<ShipmentDocChainKind>([
    'deliveryReceipt',
    'invoice',
    'paymentReceipt',
    'settlement',
  ]),
  cancelled: new Set<ShipmentDocChainKind>([
    'deliveryReceipt',
    'invoice',
    'paymentReceipt',
    'settlement',
  ]),
  closed: new Set<ShipmentDocChainKind>(),
};

@Component({
  selector: 'app-shipment-details-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Dialog],
  templateUrl: './shipment-details-dialog.html',
  styleUrl: './shipment-details-dialog.scss',
})
export class ShipmentDetailsDialog implements AfterViewInit {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly language = inject(LanguageService);

  readonly details = input.required<ShipmentDetails>();
  readonly text = input.required<ShipmentsViewTranslations>();

  readonly closed = output<void>();
  readonly editRequested = output<void>();
  readonly applyDiscountRequested = output<void>();
  readonly createPaymentVoucherRequested = output<void>();
  readonly cancelShipmentRequested = output<void>();
  readonly markAsReturnedRequested = output<void>();
  readonly receiptVouchersLogPrintRequested = output<void>();
  readonly voucherPrintRequested = output<ShipmentReceiptVoucher>();
  readonly voucherDeleteRequested = output<ShipmentReceiptVoucher>();
  readonly documentRequested = output<ShipmentDocumentKind>();
  readonly docChainNodeSelected = output<ShipmentDocChainNode>();

  protected readonly isAr = computed(() => this.language.language() === 'ar');

  protected readonly shipmentCode = computed(
    () => `SH-${String(this.details().id).padStart(3, '0')}`,
  );

  /** Footer action-button set for the current shipment status. */
  protected readonly actionsLayout = computed<DetailsActionsLayout>(() => {
    switch (this.details().status) {
      case 'draft':
        return 'draft';
      case 'ready':
      case 'assigned':
        return 'pendingDispatch';
      case 'inTransit':
        return 'inTransit';
      case 'closed':
        return 'closed';
      default:
        return 'default';
    }
  });

  ngAfterViewInit(): void {
    this.document.body.appendChild(this.host.nativeElement);
  }

  protected readonly packageTotals = computed<PackageLineTotals>(() =>
    this.details().packageLines.reduce(
      (totals, line) => ({
        packages: totals.packages + line.packageCount,
        pieces: totals.pieces + line.pieceCount,
        net: totals.net + line.netWeightKg,
        gross: totals.gross + line.grossWeightKg,
        delivered: totals.delivered + line.deliveredCount,
        shortage: totals.shortage + line.shortageCount,
      }),
      { packages: 0, pieces: 0, net: 0, gross: 0, delivered: 0, shortage: 0 },
    ),
  );

  protected statusLabel(status: ShipmentStatus): string {
    const t = this.text();
    const map: Record<ShipmentStatus, string> = {
      draft: t.statusDraft,
      ready: t.statusReady,
      assigned: t.statusAssigned,
      loaded: t.statusLoaded,
      inTransit: t.statusInTransit,
      delivered: t.statusDelivered,
      returned: t.statusReturned,
      cancelled: t.statusCancelled,
      closed: t.statusClosed,
    };
    return map[status];
  }

  protected collectionLabel(status: ShipmentCollectionStatus): string {
    const t = this.text();
    const map: Record<ShipmentCollectionStatus, string> = {
      collected: t.collectionCollected,
      partialCollected: t.collectionPartial,
      uncollected: t.collectionUncollected,
    };
    return map[status];
  }

  protected transportModeLabel(mode: ShipmentTransportMode): string {
    const t = this.text();
    const map: Record<ShipmentTransportMode, string> = {
      land: t.transportLand,
      sea: t.transportSea,
      air: t.transportAir,
      multimodal: t.transportMultimodal,
    };
    return map[mode];
  }

  protected directionLabel(direction: ShipmentDirection): string {
    const t = this.text();
    const map: Record<ShipmentDirection, string> = {
      outbound: t.directionOutbound,
      inbound: t.directionInbound,
      return: t.directionReturn,
    };
    return map[direction];
  }

  protected packageTypeLabel(type: ShipmentPackageType): string {
    const t = this.text();
    const map: Record<ShipmentPackageType, string> = {
      carton: t.packageTypeCarton,
      sack: t.packageTypeSack,
      bag: t.packageTypeBag,
      pallet: t.packageTypePallet,
      woodenBox: t.packageTypeWoodenBox,
      plasticBox: t.packageTypePlasticBox,
      roll: t.packageTypeRoll,
      other: t.packageTypeOther,
    };
    return map[type];
  }

  protected goodsCategoryLabel(category: ShipmentGoodsCategory): string {
    const t = this.text();
    const map: Record<ShipmentGoodsCategory, string> = {
      clothing: t.goodsCategoryClothing,
      shoes: t.goodsCategoryShoes,
      books: t.goodsCategoryBooks,
      foodstuff: t.goodsCategoryFoodstuff,
      furniture: t.goodsCategoryFurniture,
      electronics: t.goodsCategoryElectronics,
      industrialEquipment: t.goodsCategoryIndustrialEquipment,
      medicalEquipment: t.goodsCategoryMedicalEquipment,
      buildingMaterials: t.goodsCategoryBuildingMaterials,
      other: t.goodsCategoryOther,
    };
    return map[category];
  }

  protected paymentMethodLabel(method: ShipmentPaymentMethod): string {
    const t = this.text();
    const map: Record<ShipmentPaymentMethod, string> = {
      cash: t.paymentMethodCash,
      transfer: t.paymentMethodTransfer,
      bankDeposit: t.paymentMethodBankDeposit,
      check: t.paymentMethodCheck,
      card: t.paymentMethodCard,
    };
    return map[method];
  }

  protected stageLabel(key: ShipmentStageKey): string {
    const t = this.text();
    const map: Record<ShipmentStageKey, string> = {
      receiving: t.stageReceiving,
      shipment: t.stageShipment,
      waybill: t.stageWaybill,
      delivery: t.stageDelivery,
      settlement: t.stageSettlement,
    };
    return map[key];
  }

  protected documentLabel(kind: ShipmentDocumentKind): string {
    const t = this.text();
    const map: Record<ShipmentDocumentKind, string> = {
      receivingReceipt: t.docReceivingReceipt,
      packingList: t.docPackingList,
      deliveryAcknowledgment: t.docDeliveryAcknowledgment,
      paymentReceipt: t.docPaymentReceipt,
    };
    return map[kind];
  }

  protected docChainLabel(kind: ShipmentDocChainKind): string {
    const t = this.text();
    const map: Record<ShipmentDocChainKind, string> = {
      receivingReceipt: t.docReceivingReceipt,
      waybill: t.docWaybill,
      trip: t.docTripNumber,
      truck: t.docTruck,
      driver: t.detailsDriver,
      deliveryReceipt: t.docDeliveryReceipt,
      invoice: t.docInvoice,
      paymentReceipt: t.docPaymentReceipt,
      settlement: t.docSettlement,
    };
    return map[kind];
  }

  protected docChainIcon(kind: ShipmentDocChainKind): string {
    const map: Record<ShipmentDocChainKind, string> = {
      receivingReceipt: '📥',
      waybill: '📄',
      trip: '🚛',
      truck: '🚚',
      driver: '🧑✈️',
      deliveryReceipt: '✅',
      invoice: '🧾',
      paymentReceipt: '💰',
      settlement: '💳',
    };
    return map[kind];
  }

  protected formatMoney(value: number, currency: string): string {
    return `${value.toLocaleString('en-US')} ${currency}`;
  }

  protected currencySymbol(currency: ShipmentCurrency): string {
    return currency === 'USD' ? '$' : currency;
  }

  /** Arabic currency abbreviation when the UI language is Arabic; falls back to the ISO code / $ otherwise. */
  protected localizedCurrencySymbol(currency: ShipmentCurrency): string {
    return resolveCurrencySymbol(currency, this.language.language());
  }

  protected onDocumentPill(link: ShipmentDocumentKind): void {
    this.documentRequested.emit(link);
  }

  protected isDocChainNodeDisabled(kind: ShipmentDocChainKind): boolean {
    return DOC_CHAIN_DISABLED_KINDS[this.details().status].has(kind);
  }

  protected onDocChainNode(node: ShipmentDocChainNode): void {
    if (this.isDocChainNodeDisabled(node.kind)) return;
    this.docChainNodeSelected.emit(node);
  }

  protected onVoucherPrint(voucher: ShipmentReceiptVoucher): void {
    this.voucherPrintRequested.emit(voucher);
  }

  protected onVoucherDelete(voucher: ShipmentReceiptVoucher): void {
    const confirmed = this.document.defaultView?.confirm(
      `حذف السند — ${voucher.voucherNo}؟\nDelete Voucher — ${voucher.voucherNo}؟`,
    );
    if (!confirmed) return;
    this.voucherDeleteRequested.emit(voucher);
  }
}
