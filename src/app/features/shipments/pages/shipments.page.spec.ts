import { TestBed } from '@angular/core/testing';
import { ShipmentsPage } from './shipments.page';

describe('ShipmentsPage', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [ShipmentsPage] }).compileComponents();
  });

  it('renders the prototype summary and first page of shipments', () => {
    const fixture = TestBed.createComponent(ShipmentsPage);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.page-hero__title')?.textContent?.trim()).toBe('الشحنات');
    expect(element.querySelectorAll('tbody tr.row')).toHaveLength(8);
    expect(element.textContent).toContain('أحمد عبد الله');
  });

  it('filters by customer name and resets the result page', () => {
    const fixture = TestBed.createComponent(ShipmentsPage);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const search = element.querySelector<HTMLInputElement>('#shipment-search');

    expect(search).not.toBeNull();
    search!.value = 'النيل';
    search!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(element.querySelectorAll('tbody tr.row')).toHaveLength(1);
    expect(element.textContent).toContain('شركة النيل للاستيراد والتصدير');
  });

  it('shows the shortage banner and filters to shortage shipments on demand', () => {
    const fixture = TestBed.createComponent(ShipmentsPage);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.banner__title')?.textContent).toContain('2');

    element.querySelector<HTMLButtonElement>('.banner .btn')?.click();
    fixture.detectChanges();

    expect(element.querySelectorAll('tbody tr.row')).toHaveLength(2);
  });
});
