import { TestBed } from '@angular/core/testing';
import { CustomersPage } from './customers.page';

describe('CustomersPage', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [CustomersPage] }).compileComponents();
  });

  it('renders the prototype summary and first page of customers', () => {
    const fixture = TestBed.createComponent(CustomersPage);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.page-hero__title')?.textContent?.trim()).toBe('العملاء');
    expect(element.querySelector('.banner__title')?.textContent).toContain('622,153');
    expect(element.querySelectorAll('tbody tr.row')).toHaveLength(8);
    expect(element.textContent).toContain('أحمد عبد الله');
  });

  it('filters by customer name and resets the result page', () => {
    const fixture = TestBed.createComponent(CustomersPage);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const search = element.querySelector<HTMLInputElement>('#customer-search');

    expect(search).not.toBeNull();
    search!.value = 'النيل';
    search!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(element.querySelectorAll('tbody tr.row')).toHaveLength(1);
    expect(element.textContent).toContain('شركة النيل للاستيراد والتصدير');
  });

  it('opens the add form and surfaces required-field validation', () => {
    const fixture = TestBed.createComponent(CustomersPage);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const addButton = element.querySelector<HTMLButtonElement>('.page-hero .btn');

    addButton?.click();
    fixture.detectChanges();
    expect(element.querySelector('[role="dialog"]')).not.toBeNull();

    element.querySelector<HTMLButtonElement>('button[type="submit"]')?.click();
    fixture.detectChanges();
    expect(element.querySelectorAll('.form-error').length).toBeGreaterThan(0);
  });
});
