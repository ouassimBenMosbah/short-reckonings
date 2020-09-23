export interface Share {
  [userId: number]: {
    userId: number;
    total: number;
    moneyOwed: { userId: number; amount: number }[];
  };
}
