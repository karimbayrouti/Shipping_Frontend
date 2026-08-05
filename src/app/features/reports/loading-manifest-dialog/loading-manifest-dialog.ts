import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { DOCUMENT, DecimalPipe } from '@angular/common';
import { TripManifestData } from '@shared/ui/print-dialogs';

@Component({
  selector: 'app-loading-manifest-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
  templateUrl: './loading-manifest-dialog.html',
})
export class LoadingManifestDialog implements AfterViewInit {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly data = input.required<TripManifestData>();
  readonly closed = output<void>();

  protected readonly totalPackages = computed(() =>
    this.data().shipments.reduce((sum, r) => sum + r.packages, 0),
  );

  protected readonly totalWeightKg = computed(() =>
    this.data()
      .shipments.reduce((sum, r) => sum + r.weightKg, 0)
      .toLocaleString('ar-EG'),
  );

  ngAfterViewInit(): void {
    this.document.body.appendChild(this.host.nativeElement);
  }

  protected print(): void {
    window.print();
  }
}
