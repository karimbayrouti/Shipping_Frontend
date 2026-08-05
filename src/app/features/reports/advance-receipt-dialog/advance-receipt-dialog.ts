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
import { AdvanceReceiptPrintData } from '../models/advance-receipt-report.models';

@Component({
  selector: 'app-advance-receipt-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './advance-receipt-dialog.html',
})
export class AdvanceReceiptDialog implements AfterViewInit {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly data = input.required<AdvanceReceiptPrintData>();
  readonly closed = output<void>();

  ngAfterViewInit(): void {
    this.document.body.appendChild(this.host.nativeElement);
  }

  protected print(): void {
    window.print();
  }
}
