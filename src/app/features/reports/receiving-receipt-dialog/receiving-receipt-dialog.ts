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
import { ReceiptShipmentRow } from '@shared/ui/print-dialogs';

@Component({
  selector: 'app-receiving-receipt-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './receiving-receipt-dialog.html',
})
export class ReceivingReceiptDialog implements AfterViewInit {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly data = input.required<ReceiptShipmentRow>();
  readonly closed = output<void>();

  ngAfterViewInit(): void {
    this.document.body.appendChild(this.host.nativeElement);
  }

  protected print(): void {
    window.print();
  }
}
