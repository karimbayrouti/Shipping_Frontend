export type EmployeeStatus = 'active' | 'inactive' | 'onLeave';
export type WorkStatus = 'onRoad' | 'available' | null;
export type EmployeeSortKey = 'name' | 'position' | 'department' | 'netSalary';

export interface EmployeeSort {
  readonly key: EmployeeSortKey | null;
  readonly direction: 'asc' | 'desc';
}

export interface Employee {
  readonly id: number;
  readonly code: string; // EMP-001, DRV-001
  readonly name: string;
  readonly position: string;
  readonly department: string;
  readonly phone: string;
  readonly netSalary: number;
  readonly status: EmployeeStatus;
  readonly workStatus: WorkStatus;
  readonly assignedWork: string | null;
}

export type EmployeeDraft = Pick<
  Employee,
  'code' | 'name' | 'position' | 'department' | 'phone' | 'netSalary' | 'status'
>;
