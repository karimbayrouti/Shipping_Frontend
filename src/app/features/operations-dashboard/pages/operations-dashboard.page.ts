import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Pixel-faithful migration of the Shipping Prototype operations dashboard. */
@Component({
  selector: 'app-operations-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './operations-dashboard.page.html',
})
export class OperationsDashboardPage {}
