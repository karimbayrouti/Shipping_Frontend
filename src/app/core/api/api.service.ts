import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@env';
import { AdEmployee, ApiEnvelope } from './models/ad-employee.model';

/** Sole HttpClient boundary for the app (docs/StateAndData.md — "no exceptions"). */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  getAdEmployees(): Observable<readonly AdEmployee[]> {
    return this.http
      .get<ApiEnvelope<AdEmployee[]>>(`${environment.apiUrl}/Employee/GetADEmployees`)
      .pipe(
        map((envelope) => {
          if (!envelope.isSuccess || !envelope.data) {
            throw new Error(envelope.errorMessageEn ?? 'Failed to load AD employees');
          }
          return envelope.data;
        }),
      );
  }
}
