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
import { PackingListPrintData } from '../models/shipment-print-report.models';

@Component({
  selector: 'app-packing-list-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './packing-list-dialog.html',
})
export class PackingListDialog implements AfterViewInit {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly data = input.required<PackingListPrintData>();
  readonly closed = output<void>();

  ngAfterViewInit(): void {
    this.document.body.appendChild(this.host.nativeElement);
  }

  protected print(): void {
    window.print();
  }
}
