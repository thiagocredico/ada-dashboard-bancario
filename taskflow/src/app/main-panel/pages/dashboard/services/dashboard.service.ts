import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient);

  apiUrl = 'http://localhost:3000';

  private normalizeAccount(payload: Account | { item?: Account } | null | undefined): Account {
    if (!payload) {
      return { id: 0, name: 'Cliente', balance: 0 };
    }

    if ('item' in payload && payload.item) {
      return payload.item;
    }

    return payload as Account;
  }

  getAccount(): Observable<Account> {
    return this.http
      .get<Account | { item?: Account }>(`${this.apiUrl}/account`)
      .pipe(map((account) => this.normalizeAccount(account)));
  }

  updateAccount(account: Partial<Account>): Observable<Account> {
    return this.http
      .patch<Account | { item?: Account }>(`${this.apiUrl}/account/item`, account)
      .pipe(map((updated) => this.normalizeAccount(updated)));
  }
}
