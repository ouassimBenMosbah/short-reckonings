import { User } from './user.interface';

export interface Spending {
  spendingId: number;
  description: string;
  total: number;
  userId: number;
  user?: User;
  usersConcernedIds: number[];
  usersConcerned?: User[];
}
