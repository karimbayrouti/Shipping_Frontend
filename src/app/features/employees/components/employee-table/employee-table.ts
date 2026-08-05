import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Employee, EmployeeSort, EmployeeSortKey } from '../../models/employee.model';

@Component({
  selector: 'app-employee-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
  templateUrl: './employee-table.html',
  styleUrl: './employee-table.scss',
})
export class EmployeeTable {
  readonly employees = input.required<readonly Employee[]>();
  readonly sort = input.required<EmployeeSort>();

  readonly sortChange = output<EmployeeSortKey>();
  readonly rowClick = output<Employee>();
  readonly editClick = output<Employee>();

  protected onSort(key: EmployeeSortKey): void {
    this.sortChange.emit(key);
  }

  protected onRowClick(employee: Employee): void {
    this.rowClick.emit(employee);
  }

  protected onEditClick(employee: Employee, event: Event): void {
    event.stopPropagation();
    this.editClick.emit(employee);
  }
}
