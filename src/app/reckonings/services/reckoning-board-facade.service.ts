import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, pluck, filter } from 'rxjs/operators';
import { Bill } from './../../shared/interfaces/bill.interface';
import { Share } from './../../shared/interfaces/share.interface';
import { Spending } from './../../shared/interfaces/spending.interface';
import { User } from './../../shared/interfaces/user.interface';
import { StoreService } from './../../shared/store/store.service';

@Injectable({
  providedIn: 'root'
})
export class ReckoningBoardFacadeService {
  constructor(private storeService: StoreService) {}

  public getBill(): Observable<Bill> {
    return this.storeService.getState().pipe(pluck('1', 'bill'));
  }

  public getParticipants(): Observable<User[]> {
    return this.storeService.getUsers();
  }

  public getParticipantsRecords(): Observable<Record<number, User>> {
    return this.storeService.getUsersRecord();
  }

  public getSpendings(): Observable<Spending[]> {
    return this.storeService.getSpendings();
  }

  public getShares(): Observable<Share> {
    return this.getSpendings().pipe(
      filter((spendings) => spendings.length > 0),
      map(this.spendingsToShare)
    );
  }

  public setParticipants(users: User[]): void {
    this.storeService.setUsers(users);
  }

  public setSpendings(spendings: Spending[]): void {
    this.storeService.setSpendings(spendings);
  }

  private spendingsToShare = (spendings: Spending[]): Share => {
    const spendingsByParticipant: Share = spendings.reduce((acc: Share, curr) => {
      let res = {
        ...acc,
        [curr.userId]: {
          userId: curr.userId,
          total: curr.total + (acc[curr.userId]?.total || 0),
          moneyOwed: []
        }
      };
      const singleShare: number = curr.total / curr.usersConcernedIds.length;
      curr.usersConcernedIds.forEach((id) => {
        res = {
          ...res,
          [id]: { userId: id, total: (res[id]?.total || 0) - singleShare, moneyOwed: [] }
        };
      });
      return res;
    }, {});
    return this.minCashFlow(spendingsByParticipant);
    // tslint:disable-next-line: semicolon
  };

  private minCashFlow(spendingsByParticipant: Share): Share {
    const maxCreditor = this.arrayMax(Object.values(spendingsByParticipant));
    const maxDebitor = this.arrayMin(Object.values(spendingsByParticipant));

    if (maxCreditor.total < 1e-3 && maxDebitor.total < 1e-3) {
      return { ...spendingsByParticipant };
    }

    const min = this.minOfTwo(
      -spendingsByParticipant[maxDebitor.userId].total,
      spendingsByParticipant[maxCreditor.userId].total
    );

    spendingsByParticipant = {
      ...spendingsByParticipant,
      [maxCreditor.userId]: {
        ...spendingsByParticipant[maxCreditor.userId],
        total: spendingsByParticipant[maxCreditor.userId].total - min,
        moneyOwed: spendingsByParticipant[maxCreditor.userId].moneyOwed.concat({
          userId: maxDebitor.userId,
          amount: min
        })
      },
      [maxDebitor.userId]: {
        ...spendingsByParticipant[maxDebitor.userId],
        total: spendingsByParticipant[maxDebitor.userId].total + min
      }
    };

    return this.minCashFlow(spendingsByParticipant);
  }

  private arrayMin(arr): { total: number; userId: number } {
    return arr.reduce(
      (acc, curr) => {
        return acc.total < curr.total ? acc : curr;
      },
      { total: Infinity, userId: null }
    );
  }

  private arrayMax(arr): { total: number; userId: number } {
    return arr.reduce(
      (acc, curr) => {
        return acc.total > curr.total ? acc : curr;
      },
      { total: -Infinity, userId: null }
    );
  }

  private minOfTwo(a: number, b: number): number {
    return a < b ? a : b;
  }
}
