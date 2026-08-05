import { ChangeDetectionStrategy, Component, OnInit, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee, EmployeeDraft } from '../../models/employee.model';

@Component({
  selector: 'app-employee-form-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './employee-form-dialog.html',
  styleUrl: './employee-form-dialog.scss',
})
export class EmployeeFormDialog implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  readonly employee = input<Employee | null>(null);
  readonly closed = output<void>();
  readonly saved = output<EmployeeDraft>();

  protected readonly form = this.formBuilder.nonNullable.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    position: ['', Validators.required],
    department: ['', Validators.required],
    phone: ['', Validators.required],
    netSalary: [0, [Validators.required, Validators.min(0)]],
    status: ['active' as Employee['status'], Validators.required],
  });

  ngOnInit(): void {
    const employee = this.employee();
    if (employee) this.form.reset(employee);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saved.emit(this.form.getRawValue());
  }

  protected closeFromBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.closed.emit();
  }
}
