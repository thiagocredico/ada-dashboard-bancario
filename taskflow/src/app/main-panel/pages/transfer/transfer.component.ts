import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AccountStateService } from '../../../core/services/account-state.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css'],
})
export class TransferComponent {
  private fb = inject(FormBuilder);
  private accountState = inject(AccountStateService);

  account$ = this.accountState.account$;
  destinationAccounts = ['Conta Corrente 0012', 'Conta Poupança 5021', 'Conta Empresa 7770'];

  form = this.fb.group({
    destinationAccount: ['', [Validators.required]],
    amount: [null, [Validators.required, Validators.min(0.01)]],
    description: [''],
  });

  loading = false;
  error: string | null = null;
  success = false;

  submit(): void {
    this.error = null;
    this.success = false;
    if (this.form.invalid) return;

    const destinationAccount = this.form.get('destinationAccount')!.value as string;
    const rawAmount = this.form.get('amount')!.value;
    const amount = rawAmount == null ? NaN : Number(rawAmount);
    const description = (this.form.get('description')!.value as string) || '';

    this.accountState.account$.pipe(take(1)).subscribe((acc) => {
      if (!acc) {
        this.error = 'Conta não carregada';
        return;
      }
      if (isNaN(amount) || amount <= 0) {
        this.error = 'Valor inválido';
        return;
      }

      if (acc.balance < amount) {
        this.error = 'Saldo insuficiente';
        return;
      }

      this.loading = true;
      this.accountState.transfer(destinationAccount, amount, description)
        .subscribe({
          next: () => {
            this.loading = false;
            this.success = true;
            this.form.reset();
          },
          error: (err) => {
            this.loading = false;
            this.error = err?.message || 'Erro ao realizar transferência';
          },
        });
    });
  }
}
