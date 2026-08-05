import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ShipmentsViewTranslations } from '@core/i18n';
import { Shipment } from '../../models/shipment.model';
import { resolveCurrencySymbol } from '../../utils/currency.util';

@Component({
  selector: 'app-shipment-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shipment-table.html',
  styleUrl: './shipment-table.scss',
})
export class ShipmentTable {
  readonly rows = input.required<readonly Shipment[]>();
  readonly total = input.required<number>();
  readonly page = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly pageCount = input.required<number>();
  readonly text = input.required<ShipmentsViewTranslations>();
  readonly locale = input.required<'ar' | 'en'>();

  readonly pageChange = output<number>();
  readonly viewShipment = output<Shipment>();
  readonly recordPayment = output<Shipment>();
  readonly receiveShipment = output<Shipment>();
  readonly transferShipment = output<Shipment>();

  protected shipmentCode(id: number): string {
    return `SH-${String(id).padStart(3, '0')}`;
  }

  protected formatMoney(value: number, currency: string): string {
    return `${value.toLocaleString('en-US')} ${currency}`;
  }

  /** Arabic currency abbreviation when the UI language is Arabic; falls back to the ISO code / $ otherwise. */
  protected localizedCurrencySymbol(currency: Shipment['currency']): string {
    return resolveCurrencySymbol(currency, this.locale());
  }

  protected startIndex(): number {
    return this.total() === 0 ? 0 : this.page() * this.pageSize() + 1;
  }

  protected endIndex(): number {
    return Math.min((this.page() + 1) * this.pageSize(), this.total());
  }

  protected previousSymbol(): string {
    return this.locale() === 'ar' ? '›' : '‹';
  }

  protected nextSymbol(): string {
    return this.locale() === 'ar' ? '‹' : '›';
  }

  protected warehouseLabel(warehouse: Shipment['warehouse']): string {
    const map: Record<Shipment['warehouse'], string> = {
      cairo: this.text().warehouseCairo,
      alexandria: this.text().warehouseAlexandria,
      kuwait: this.text().warehouseKuwait,
      doha: this.text().warehouseDoha,
    };
    return map[warehouse];
  }

  protected collectionLabel(status: NonNullable<Shipment['collectionStatus']>): string {
    const map: Record<NonNullable<Shipment['collectionStatus']>, string> = {
      collected: this.text().collectionCollected,
      partialCollected: this.text().collectionPartial,
      uncollected: this.text().collectionUncollected,
    };
    return map[status];
  }

  protected statusLabel(status: Shipment['status']): string {
    const map: Record<Shipment['status'], string> = {
      draft: this.text().statusDraft,
      ready: this.text().statusReady,
      assigned: this.text().statusAssigned,
      loaded: this.text().statusLoaded,
      inTransit: this.text().statusInTransit,
      delivered: this.text().statusDelivered,
      returned: this.text().statusReturned,
      cancelled: this.text().statusCancelled,
      closed: this.text().statusClosed,
    };
    return map[status];
  }

  protected openRow(shipment: Shipment): void {
    this.viewShipment.emit(shipment);
  }

  protected onRowKeydown(event: KeyboardEvent, shipment: Shipment): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this.openRow(shipment);
  }

  protected view(event: Event, shipment: Shipment): void {
    event.stopPropagation();
    this.viewShipment.emit(shipment);
  }

  protected pay(event: Event, shipment: Shipment): void {
    event.stopPropagation();
    this.recordPayment.emit(shipment);
  }

  protected receive(event: Event, shipment: Shipment): void {
    event.stopPropagation();
    this.receiveShipment.emit(shipment);
  }

  protected transfer(event: Event, shipment: Shipment): void {
    event.stopPropagation();
    this.transferShipment.emit(shipment);
  }

  /** New payment vouchers are only meaningful once cash can actually be collected. */
  protected canRecordPayment(status: Shipment['status']): boolean {
    return (
      status === 'inTransit' ||
      status === 'delivered' ||
      status === 'assigned' ||
      status === 'returned'
    );
  }

  /** Draft shipments must be received into the warehouse before anything else. */
  protected canReceive(status: Shipment['status']): boolean {
    return status === 'draft';
  }

  /** Warehouse transfer only makes sense before the shipment leaves on a trip. */
  protected canTransfer(status: Shipment['status']): boolean {
    return status === 'ready' || status === 'draft';
  }
}
