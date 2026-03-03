import { Component, inject } from '@angular/core';
import { Pages } from '../constants/pages.enum';
import { RouterService } from '../core/services/router.service';
import { MenuItem } from '../models/menu-item.model';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  imports: [AsyncPipe, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private readonly routerService = inject(RouterService);

  page$ = this.routerService.getCurrentPage();

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'grid_view',
      page: Pages.DASHBOARD,
      selected: true,
    },
    {
      label: 'Extrato',
      icon: 'article',
      page: Pages.TRANSACTIONS,
      selected: false,
    },
    {
      label: 'Transferência',
      icon: 'sync_alt',
      page: Pages.TRANSFER,
      selected: false,
    },
    {
      label: 'Crédito',
      icon: 'credit_card',
      page: Pages.LOAN,
      selected: false,
    },
  ];

  redirectToPage(page: Pages): void {
    this.routerService.setCurrentPage(page);
  }

  /*
    Comunicação entre components
      DO .ts para o template
        Interpolação de string {{}
      Pai pra filho
        Property Binding []
      Filho para pai
        Event binding ()
      Pai para filho e filho para pai, ao mesmo tempo
        Two way binding [()]
      Comunicação entre componentes irmãos
        Estado centralizado (services ou ngrx)
  */
}
