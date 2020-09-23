import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';
import { Bill } from './../interfaces/bill.interface';
import { Spending } from './../interfaces/spending.interface';
import { User } from './../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private initialState: State = {
    bill: { 1: { billId: 1, spendingIds: [] } },
    spendings: {},
    users: {}
  };
  private state: BehaviorSubject<State> = new BehaviorSubject(this.initialState);
  private stateKey = 'appState';

  constructor() {
    const savedState: State = JSON.parse(localStorage.getItem(this.stateKey));
    if (savedState) {
      this.state.next(savedState);
    } else {
      localStorage.setItem(this.stateKey, JSON.stringify(this.state.getValue()));
    }
  }

  public getState(): Observable<State> {
    return this.state.asObservable().pipe(
      map((state: State) => ({
        ...state,
        users: this.entityDictionaryToArray(state.users),
        spendings: this.entityDictionaryToArray(state.spendings)
      }))
    );
  }

  public getUsers(): Observable<User[]> {
    return this.state.asObservable().pipe(pluck('users'), map(this.entityDictionaryToArray));
  }

  public getUsersRecord(): Observable<Record<number, User>> {
    return this.state.asObservable().pipe(pluck('users'));
  }

  public getSpendings(): Observable<Spending[]> {
    return this.getUsers().pipe(
      map((users: User[]) => this.entityArrayToDictionary(users, 'userId')),
      switchMap((users: Record<number, User>) => {
        return this.state.asObservable().pipe(
          pluck('spendings'),
          map(this.entityDictionaryToArray),
          map((spendings: Spending[]) => {
            return spendings.map((spending: Spending) => {
              return { ...spending, user: users[spending.userId] } as Spending;
            });
          })
        );
      })
    );
  }

  public setUsers(users: User[]): void {
    const oldState: State = this.state.getValue();
    this.state.next({
      ...oldState,
      users: this.entityArrayToDictionary(users, 'userId')
    });
    localStorage.setItem(this.stateKey, JSON.stringify(this.state.getValue()));
  }

  public setSpendings(spendings: Spending[]): void {
    const oldState: State = this.state.getValue();
    this.state.next({
      ...oldState,
      spendings: this.entityArrayToDictionary(spendings, 'spendingId')
    });
    localStorage.setItem(this.stateKey, JSON.stringify(this.state.getValue()));
  }

  public setState(newBill: Bill): void {
    const { billId, spendings } = newBill;
    const users: User[] = spendings
      .map((spending) => spending.user)
      .concat(...spendings.map((spending) => spending.usersConcerned));

    this.state.next({
      bill: { [billId]: { billId, spendingIds: newBill.spendingIds } },
      users: this.entityArrayToDictionary([...new Set(users)], 'userId'),
      spendings: this.entityArrayToDictionary(
        spendings.map(({ user, usersConcerned, ...prop }: Spending) => {
          return { ...prop };
        }),
        'spendingId'
      )
    });

    localStorage.setItem(this.stateKey, JSON.stringify(this.state.getValue()));
  }

  private entityArrayToDictionary<T>(arr: T[], idKey: string): Record<number, T> {
    return arr.reduce((acc, curr: T) => ({ ...acc, [curr[idKey]]: curr }), {} as Record<number, T>);
  }

  private entityDictionaryToArray<T>(object: Record<number, T>): T[] {
    return Object.values(object);
  }
}

interface State {
  bill: Record<number, Bill>;
  spendings: Record<number, Spending>;
  users: Record<number, User>;
}
