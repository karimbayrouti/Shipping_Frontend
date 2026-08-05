import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '@core/i18n/language.service';
import { EmployeeDetailsDialog } from '../../components/employee-details-dialog/employee-details-dialog';
import { EmployeeFormDialog } from '../../components/employee-form-dialog/employee-form-dialog';
import { EmployeeTable } from '../../components/employee-table/employee-table';
import { EMPLOYEE_FIXTURES } from '../../employees.data';
import {
  Employee,
  EmployeeDraft,
  EmployeeSort,
  EmployeeSortKey,
} from '../../models/employee.model';

const PAGE_SIZE = 8;

type DialogState =
  | { readonly kind: 'closed' }
  | { readonly kind: 'details'; readonly employee: Employee }
  | { readonly kind: 'form'; readonly employee: Employee | null };

@Component({
  selector: 'app-employees-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EmployeeTable, EmployeeDetailsDialog, EmployeeFormDialog],
  templateUrl: './employees.page.html',
  styleUrl: './employees.page.scss',
})
export class EmployeesPage {
  private readonly language = inject(LanguageService);
  protected readonly Math = Math;

  protected readonly text = computed(() => ({
    ...this.language.translations().employees,
    ...this.language.translations().common.actions,
  }));
  protected readonly locale = this.language.language;

  protected readonly employees = signal<readonly Employee[]>(EMPLOYEE_FIXTURES);
  protected readonly query = signal('');
  protected readonly page = signal(0);
  protected readonly sort = signal<EmployeeSort>({ key: null, direction: 'asc' });
  protected readonly dialog = signal<DialogState>({ kind: 'closed' });

  protected readonly detailsEmployee = computed(() => {
    const dialog = this.dialog();
    return dialog.kind === 'details' ? dialog.employee : null;
  });
  protected readonly formEmployee = computed(() => {
    const dialog = this.dialog();
    return dialog.kind === 'form' ? dialog.employee : null;
  });
  protected readonly isFormOpen = computed(() => this.dialog().kind === 'form');

  protected readonly driverCount = computed(
    () => this.employees().filter((e) => e.position === 'سائق').length,
  );
  protected readonly availableDriverCount = computed(
    () => this.employees().filter((e) => e.workStatus === 'available').length,
  );
  protected readonly onRoadDriverCount = computed(
    () => this.employees().filter((e) => e.workStatus === 'onRoad').length,
  );

  protected readonly filteredEmployees = computed(() => {
    const query = this.query().trim().toLocaleLowerCase(this.locale());
    if (!query) return this.employees();
    return this.employees().filter((employee) =>
      [employee.name, employee.code, employee.phone, employee.position, employee.department].some(
        (value) => value.toLocaleLowerCase(this.locale()).includes(query),
      ),
    );
  });

  protected readonly sortedEmployees = computed(() => {
    const sort = this.sort();
    const key = sort.key;
    if (!key) return this.filteredEmployees();
    return [...this.filteredEmployees()].sort((left, right) => {
      const result = this.compare(left[key], right[key]);
      return sort.direction === 'asc' ? result : -result;
    });
  });

  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.sortedEmployees().length / PAGE_SIZE)),
  );
  protected readonly visibleEmployees = computed(() => {
    const validPage = Math.min(this.page(), this.pageCount() - 1);
    const start = validPage * PAGE_SIZE;
    return this.sortedEmployees().slice(start, start + PAGE_SIZE);
  });

  protected readonly pageSize = PAGE_SIZE;

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.page.set(0);
  }

  protected changeSort(key: EmployeeSortKey): void {
    this.sort.update((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
    this.page.set(0);
  }

  protected changePage(page: number): void {
    this.page.set(Math.max(0, Math.min(page, this.pageCount() - 1)));
  }

  protected openDetails(employee: Employee): void {
    this.dialog.set({ kind: 'details', employee });
  }

  protected openForm(employee: Employee | null = null): void {
    this.dialog.set({ kind: 'form', employee });
  }

  protected editFromDetails(employee: Employee): void {
    this.openForm(employee);
  }

  protected closeDialog(): void {
    this.dialog.set({ kind: 'closed' });
  }

  protected saveEmployee(draft: EmployeeDraft): void {
    const dialog = this.dialog();
    if (dialog.kind !== 'form') return;

    if (dialog.employee) {
      this.employees.update((employees) =>
        employees.map((employee) =>
          employee.id === dialog.employee?.id ? { ...employee, ...draft } : employee,
        ),
      );
    } else {
      const id = Math.max(0, ...this.employees().map((e) => e.id)) + 1;
      this.employees.update((employees) => [
        ...employees,
        { ...draft, id, workStatus: null, assignedWork: null },
      ]);
    }
    this.closeDialog();
  }

  protected formatNumber(value: number): string {
    return value.toLocaleString('en-US');
  }

  private compare(left: string | number, right: string | number): number {
    if (typeof left === 'number' && typeof right === 'number') return left - right;
    return String(left).localeCompare(String(right), this.locale());
  }
}
