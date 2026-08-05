import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TrucksViewTranslations } from '@core/i18n';
import { Truck, TruckStatus } from '../../models/truck.model';

@Component({
  selector: 'app-truck-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './truck-table.html',
  styleUrl: './truck-table.scss',
})
export class TruckTable {
  readonly rows = input.required<readonly Truck[]>();
  readonly text = input.required<TrucksViewTranslations>();

  readonly viewHistory = output<Truck>();
  readonly editTruck = output<Truck>();

  protected formatCapacity(kg: number): string {
    return `${kg.toLocaleString('en-US')} ${this.text().unitKg}`;
  }

  protected formatCost(egp: number): string {
    return `${egp.toLocaleString('en-US')} ${this.text().unitEgp}`;
  }

  protected statusLabel(status: TruckStatus, text: TrucksViewTranslations): string {
    const map: Record<TruckStatus, string> = {
      onRoad: text.statusOnRoad,
      available: text.statusAvailable,
      offDuty: text.statusOffDuty,
    };
    return map[status];
  }

  protected onRowClick(truck: Truck): void {
    this.viewHistory.emit(truck);
  }

  protected onHistoryClick(event: Event, truck: Truck): void {
    event.stopPropagation();
    this.viewHistory.emit(truck);
  }

  protected onEditClick(event: Event, truck: Truck): void {
    event.stopPropagation();
    this.editTruck.emit(truck);
  }
}
