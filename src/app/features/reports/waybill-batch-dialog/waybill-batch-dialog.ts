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
import { WaybillBatchData } from '@shared/ui/print-dialogs';

@Component({
  selector: 'app-waybill-batch-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './waybill-batch-dialog.html',
})
export class WaybillBatchDialog implements AfterViewInit {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly data = input.required<WaybillBatchData>();
  readonly closed = output<void>();

  ngAfterViewInit(): void {
    this.document.body.appendChild(this.host.nativeElement);
  }

  protected print(): void {
    window.print();
  }
}
