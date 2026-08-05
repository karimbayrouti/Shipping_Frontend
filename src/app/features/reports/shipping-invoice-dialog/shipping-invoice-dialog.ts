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
import { ShippingInvoicePrintData } from '../models/shipment-print-report.models';

@Component({
  selector: 'app-shipping-invoice-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shipping-invoice-dialog.html',
})
export class ShippingInvoiceDialog implements AfterViewInit {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly data = input.required<ShippingInvoicePrintData>();
  readonly closed = output<void>();

  ngAfterViewInit(): void {
    this.document.body.appendChild(this.host.nativeElement);
  }

  protected print(): void {
    window.print();
  }
}
