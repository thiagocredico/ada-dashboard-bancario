import { Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { first } from 'rxjs';
import { Transaction } from '../../models/transaction.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterService } from '../../../../../core/services/router.service';
import { TransactionPagesEnum } from '../../constants/transaction-pages.enum';
import { FormsModule } from '@angular/forms';
import { AccountStateService } from '../../../../../core/services/account-state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-list-transactions',
  imports: [
    DatePipe,
    CurrencyPipe,
    FormsModule,
    MatSortModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './list-transactions.component.html',
  styleUrl: './list-transactions.component.css',
})
export class ListTransactionsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly routerService = inject(RouterService);
  private readonly accountState = inject(AccountStateService);
  private readonly dialog = inject(MatDialog);

  @Output() editEmitter = new EventEmitter<string>();

  transactions: Transaction[] = [];
  searchTerm = '';
  accountBalance = 0;
  sortState: Sort = { active: 'date', direction: 'desc' };

  get filteredTransactions(): Transaction[] {
    const normalized = this.searchTerm.trim().toLowerCase();
    if (!normalized) {
      return this.transactions;
    }

    return this.transactions.filter((item) => {
      const date = new Date(item.date).toLocaleDateString('pt-BR');
      return (
        item.description.toLowerCase().includes(normalized) ||
        date.includes(normalized)
      );
    });
  }

  get totalIncome(): number {
    return this.accountBalance;
  }

  get totalExpense(): number {
    return this.transactions
      .filter((item) => item.amount < 0)
      .reduce((sum, item) => sum + Math.abs(item.amount), 0);
  }

  get sortedFilteredTransactions(): Transaction[] {
    return this.sortTransactions(this.filteredTransactions, this.sortState);
  }

  ngOnInit(): void {
    this.accountState.account$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((account) => {
        this.accountBalance = account?.balance || 0;
      });

    this.accountState.transactions$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((transactions) => {
        this.transactions = transactions;
      });
  }

  redirectToCreate(): void {
    this.routerService.setTransactionPage(TransactionPagesEnum.CREATE);
  }

  onEdit(id: string): void {
    this.editEmitter.emit(id);
  }

  onDelete(id: string): void {
    const transactionToDelete = this.transactions.find((item) => item.id === id);
    if (!transactionToDelete) {
      return;
    }

    const deletedAmount = transactionToDelete?.amount ?? 0;

    this.dialog
      .open(ConfirmDeleteDialogComponent, {
        width: '420px',
        data: { description: transactionToDelete.description },
      })
      .afterClosed()
      .pipe(first())
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }

        this.accountState
          .deleteTransactionWithBalance(id, deletedAmount)
          .pipe(first())
          .subscribe({
            next: () => {},
            error: () => {},
          });
      });
  }

  onSortChange(sort: Sort): void {
    this.sortState = sort;
  }

  private sortTransactions(items: Transaction[], sort: Sort): Transaction[] {
    const data = [...items];

    if (!sort.active || !sort.direction) {
      return data;
    }

    const isAsc = sort.direction === 'asc';

    return data.sort((a, b) => {
      switch (sort.active) {
        case 'date':
          return this.compare(new Date(a.date).getTime(), new Date(b.date).getTime(), isAsc);
        case 'description':
          return this.compare(a.description.toLowerCase(), b.description.toLowerCase(), isAsc);
        case 'type':
          return this.compare(a.type, b.type, isAsc);
        case 'amount':
          return this.compare(a.amount, b.amount, isAsc);
        default:
          return 0;
      }
    });
  }

  private compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
