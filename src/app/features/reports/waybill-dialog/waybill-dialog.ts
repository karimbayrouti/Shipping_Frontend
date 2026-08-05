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
import { WaybillShipmentRow } from '@shared/ui/print-dialogs';

@Component({
  selector: 'app-waybill-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './waybill-dialog.html',
})
export class WaybillDialog implements AfterViewInit {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly data = input.required<WaybillShipmentRow>();
  readonly closed = output<void>();

  ngAfterViewInit(): void {
    this.document.body.appendChild(this.host.nativeElement);
  }

  protected print(): void {
    window.print();
  }
}
