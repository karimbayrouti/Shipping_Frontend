import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    service = TestBed.inject(ThemeService);
  });

  it('defaults to light and stamps the html attribute', () => {
    TestBed.tick();
    expect(service.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('toggle switches theme, updates the DOM and persists', () => {
    service.toggle();
    TestBed.tick();
    expect(service.theme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('ntx.theme')).toBe('"dark"');
  });
});
