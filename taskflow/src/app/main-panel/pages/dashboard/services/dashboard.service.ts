import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient);

  apiUrl = 'http://localhost:3000';

  getAccount(): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/account`);
  }

  updateAccount(account: Partial<Account>): Observable<Account> {
    return this.http.patch<Account>(`${this.apiUrl}/account`, account);
  }
}
