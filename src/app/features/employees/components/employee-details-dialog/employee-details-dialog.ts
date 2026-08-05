import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-details-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './employee-details-dialog.html',
})
export class EmployeeDetailsDialog {
  readonly employee = input.required<Employee>();
  readonly closed = output<void>();
  readonly edit = output<Employee>();

  protected closeFromBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.closed.emit();
  }
}
