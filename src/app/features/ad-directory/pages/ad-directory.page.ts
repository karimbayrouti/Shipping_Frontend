import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ApiService } from '@core/api/api.service';

@Component({
  selector: 'app-ad-directory-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ad-directory.page.html',
  styleUrl: './ad-directory.page.scss',
})
export class AdDirectoryPage {
  private readonly api = inject(ApiService);

  protected readonly employees = rxResource({
    stream: () => this.api.getAdEmployees(),
  });
}
