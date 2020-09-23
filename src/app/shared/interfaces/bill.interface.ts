import { Spending } from './spending.interface';

export interface Bill {
  billId: number;
  spendingIds: Spending[];
  spendings?: Spending[];
}
