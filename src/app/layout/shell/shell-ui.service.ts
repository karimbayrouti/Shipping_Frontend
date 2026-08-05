import { Injectable, signal } from '@angular/core';

export type HeaderMenu = 'quick' | 'notifications' | 'profile' | null;

@Injectable({ providedIn: 'root' })
export class ShellUiService {
  readonly sidebarOpen = signal(false);
  readonly sidebarCollapsed = signal(false);
  readonly headerMenu = signal<HeaderMenu>(null);

  closeMenus(): void {
    this.headerMenu.set(null);
  }
}
