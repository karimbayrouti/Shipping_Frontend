import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTable } from './employee-table';

describe('EmployeeTable', () => {
  let component: EmployeeTable;
  let fixture: ComponentFixture<EmployeeTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeTable],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeTable);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('employees', []);
    fixture.componentRef.setInput('sort', { key: null, direction: 'asc' });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
