import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DeliveryReceiptPrintData } from '../models/shipment-print-report.models';

@Component({
  selector: 'app-delivery-receipt-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './delivery-receipt-dialog.html',
})
export class DeliveryReceiptDialog implements AfterViewInit {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly data = input.required<DeliveryReceiptPrintData>();
  readonly closed = output<void>();

  ngAfterViewInit(): void {
    this.document.body.appendChild(this.host.nativeElement);
  }

  protected print(): void {
    window.print();
  }
}
