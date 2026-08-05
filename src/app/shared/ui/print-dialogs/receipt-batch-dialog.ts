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
import { ReceiptBatchData } from './report.models';

@Component({
  selector: 'app-receipt-batch-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './receipt-batch-dialog.html',
})
export class ReceiptBatchDialog implements AfterViewInit {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly data = input.required<ReceiptBatchData>();
  readonly closed = output<void>();

  ngAfterViewInit(): void {
    this.document.body.appendChild(this.host.nativeElement);
  }

  protected print(): void {
    window.print();
  }
}
