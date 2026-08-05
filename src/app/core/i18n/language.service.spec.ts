import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(LanguageService);
  });

  it('defaults to Arabic / RTL like the Shipping Prototype', () => {
    TestBed.tick();
    expect(service.language()).toBe('ar');
    expect(service.direction()).toBe('rtl');
    expect(document.documentElement.dir).toBe('rtl');
    expect(service.translations().customers.pageTitle).toBe('العملاء');
    expect(service.translations().common.actions.save).toBe('حفظ');
  });

  it('switching to English flips direction to LTR on the document', () => {
    service.set('en');
    TestBed.tick();
    expect(service.direction()).toBe('ltr');
    expect(document.documentElement.dir).toBe('ltr');
    expect(document.documentElement.lang).toBe('en');
    expect(localStorage.getItem('ntx.language')).toBe('"en"');
    expect(service.translations().customers.pageTitle).toBe('Customers');
    expect(service.translations().common.actions.save).toBe('Save');
  });
});
