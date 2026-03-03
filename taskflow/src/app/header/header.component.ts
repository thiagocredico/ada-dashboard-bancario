import { Component, DestroyRef, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AccountStateService } from '../core/services/account-state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly accountState = inject(AccountStateService);

  accountName = 'Cliente';

  constructor() {
    this.accountState.account$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((account) => {
        this.accountName = account?.name || 'Cliente';
      });
  }
}
