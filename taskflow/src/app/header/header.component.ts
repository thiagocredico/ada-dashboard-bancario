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
  isLight = false;

  constructor() {
    this.accountState.account$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((account) => {
        this.accountName = account?.name ?? 'Cliente';
      });

    try {
      const stored = localStorage.getItem('theme');
      this.isLight = stored === 'light';
    } catch (e) {
      this.isLight = false;
    }
    this.applyTheme();
  }

  toggleTheme() {
    this.isLight = !this.isLight;
    try {
      localStorage.setItem('theme', this.isLight ? 'light' : 'dark');
    } catch (e) {}
    this.applyTheme();
  }

  private applyTheme() {
    const root = document.documentElement;
    if (this.isLight) root.classList.add('light');
    else root.classList.remove('light');
  }
}
