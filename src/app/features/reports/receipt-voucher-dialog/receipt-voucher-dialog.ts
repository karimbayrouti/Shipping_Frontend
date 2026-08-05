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
import { ReceiptVoucherPrintData } from '../models/receipt-voucher-report.models';

@Component({
  selector: 'app-receipt-voucher-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './receipt-voucher-dialog.html',
})
export class ReceiptVoucherDialog implements AfterViewInit {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly data = input.required<ReceiptVoucherPrintData>();
  readonly closed = output<void>();

  ngAfterViewInit(): void {
    this.document.body.appendChild(this.host.nativeElement);
  }

  protected print(): void {
    window.print();
  }
}
