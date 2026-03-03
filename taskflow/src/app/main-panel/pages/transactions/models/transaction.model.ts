import { TransactionTypes } from '../constants/transaction-types.enum';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionTypes;
}
