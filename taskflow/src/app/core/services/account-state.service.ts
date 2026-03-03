import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { DashboardService } from '../../main-panel/pages/dashboard/services/dashboard.service';
import { TransactionsService } from '../../main-panel/pages/transactions/services/transactions.service';
import { Account } from '../../main-panel/pages/dashboard/models/account.model';
import { Transaction } from '../../main-panel/pages/transactions/models/transaction.model';
import { TransactionTypes } from '../../main-panel/pages/transactions/constants/transaction-types.enum';

@Injectable({
  providedIn: 'root',
})
export class AccountStateService {
  private dashboardService = inject(DashboardService);
  private transactionsService = inject(TransactionsService);

  private accountSubject = new BehaviorSubject<Account | null>(null);
  account$ = this.accountSubject.asObservable();

  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this.transactionsSubject.asObservable();

  loadInitial(): void {
    this.dashboardService.getAccount().subscribe((acc) => this.accountSubject.next(acc));
    this.transactionsService.getTransactions().subscribe((tx) => this.transactionsSubject.next(tx));
  }

  refreshTransactions(): Observable<void> {
    return this.transactionsService.getTransactions().pipe(
      tap((tx) => this.transactionsSubject.next(tx)),
      map(() => void 0),
    );
  }

  applyBalanceDelta(delta: number): Observable<void> {
    const acc = this.accountSubject.getValue();
    if (!acc) return throwError(() => new Error('Conta não carregada'));

    const updatedBalance = Number((acc.balance + delta).toFixed(2));

    return this.dashboardService.updateAccount({ balance: updatedBalance }).pipe(
      tap((updatedAccount) => {
        this.accountSubject.next({ ...acc, ...updatedAccount, balance: updatedBalance });
      }),
      map(() => void 0),
    );
  }

  createTransactionWithBalance(transaction: Transaction): Observable<void> {
    return this.transactionsService.createTransaction(transaction).pipe(
      switchMap(() => this.applyBalanceDelta(transaction.amount)),
      switchMap(() => this.refreshTransactions()),
    );
  }

  updateTransactionWithBalance(
    transaction: Transaction,
    id: string,
    originalAmount: number,
  ): Observable<void> {
    const delta = transaction.amount - originalAmount;

    return this.transactionsService.updateTransaction(transaction, id).pipe(
      switchMap(() => this.applyBalanceDelta(delta)),
      switchMap(() => this.refreshTransactions()),
    );
  }

  deleteTransactionWithBalance(id: string, deletedAmount: number): Observable<void> {
    return this.transactionsService.deleteTransaction(id).pipe(
      switchMap(() => this.applyBalanceDelta(-deletedAmount)),
      switchMap(() => this.refreshTransactions()),
    );
  }

  transfer(destinationAccount: string, amount: number, description: string): Observable<void> {
    const acc = this.accountSubject.getValue();
    if (!acc) return throwError(() => new Error('Conta não carregada'));
    if (amount <= 0) return throwError(() => new Error('Valor deve ser maior que zero'));
    if (acc.balance < amount) return throwError(() => new Error('Saldo insuficiente'));

    const transferAmount = -Math.abs(amount);

    const tx: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      description: `Transferência para ${destinationAccount} - ${description}`,
      amount: transferAmount,
      type: TransactionTypes.EXPENSE,
    };

    return this.transactionsService.createTransaction(tx).pipe(
      switchMap(() => this.applyBalanceDelta(-amount)),
      tap(() => {
        this.transactionsSubject.next([tx, ...this.transactionsSubject.getValue()]);
      })
    );
  }

  applyLoan(amount: number): Observable<void> {
    const acc = this.accountSubject.getValue();
    if (!acc) return throwError(() => new Error('Conta não carregada'));
    if (amount <= 0) return throwError(() => new Error('Valor deve ser maior que zero'));

    const tx: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      description: `Empréstimo - crédito de R$ ${amount.toFixed(2)}`,
      amount: amount,
      type: TransactionTypes.INCOME,
    };

    return this.transactionsService.createTransaction(tx).pipe(
      switchMap(() => this.applyBalanceDelta(amount)),
      tap(() => {
        this.transactionsSubject.next([tx, ...this.transactionsSubject.getValue()]);
      })
    );
  }
}
