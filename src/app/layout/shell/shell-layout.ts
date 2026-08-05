import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { ShellUiService } from './shell-ui.service';

/**
 * The authenticated application shell: sidebar + header + routed content.
 * Registered as a parent route in app.routes.ts; every application page
 * renders inside its outlet. (The auth layout arrives with Phase 3/5.)
 */
@Component({
  selector: 'app-shell-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Sidebar, Header],
  templateUrl: './shell-layout.html',
})
export class ShellLayout {
  protected readonly shellUi = inject(ShellUiService);
}
