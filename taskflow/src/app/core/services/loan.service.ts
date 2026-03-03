import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  /**
   * Calcula o valor da parcela e o total a pagar.
   * @param principal valor solicitado
   * @param installments número de parcelas
   * @param monthlyRatePercent taxa de juros mensal em porcentagem (ex: 2 => 2%)
   */
  calculate(principal: number, installments: number, monthlyRatePercent: number) {
    const r = monthlyRatePercent / 100;
    if (installments <= 0) throw new Error('Parcelas deve ser maior que zero');
    if (r === 0) {
      const monthly = principal / installments;
      return { monthly, total: principal };
    }

    const monthly = (principal * r) / (1 - Math.pow(1 + r, -installments));
    const total = monthly * installments;
    return { monthly, total };
  }
}
