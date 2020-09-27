import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Share } from './../../../shared/interfaces/share.interface';
import { Spending } from './../../../shared/interfaces/spending.interface';
import { Tab } from './../../../shared/interfaces/tab.interface';
import { User } from './../../../shared/interfaces/user.interface';
import { ReckoningBoardFacadeService } from './../../services/reckoning-board-facade.service';

@Component({
  selector: 'app-reckoning-board',
  templateUrl: './reckoning-board.component.html',
  styleUrls: ['./reckoning-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReckoningBoardComponent implements OnInit {
  private tabs: Record<number, Tab>;

  public tabSlectedIndex: number;
  public focusedTab: Tab;
  public obsInitial$: Observable<{ participants$: User[]; spendings$: Spending[] }>;
  public obsRes$: Observable<{ shares$: Share; participantsRecord$: Record<number, User> }>;

  constructor(
    private reckoningBoardFacadeService: ReckoningBoardFacadeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.tabs = this.getTabs();

    this.tabSlectedIndex = this.focusOnInitialTab(this.tabs, this.route);

    this.onSelectedIndexChange(this.tabSlectedIndex);

    this.obsInitial$ = combineLatest([
      this.reckoningBoardFacadeService.getParticipants(),
      this.reckoningBoardFacadeService.getSpendings()
    ]).pipe(
      map(([participants, spendings]) => ({ participants$: participants, spendings$: spendings }))
    );
    this.obsRes$ = combineLatest([
      this.reckoningBoardFacadeService.getShares(),
      this.reckoningBoardFacadeService.getParticipantsRecords()
    ]).pipe(
      map(([shares, participantsRecord]: [Share, Record<number, User>]) => ({
        shares$: shares,
        participantsRecord$: participantsRecord
      }))
    );
  }

  public onSelectedIndexChange(index: number): void {
    this.focusedTab = this.tabs[index];
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: this.tabs[index].queryParam }
    });
  }

  public onSpendingsChanges(spendings: Spending[]): void {
    this.reckoningBoardFacadeService.setSpendings(spendings);
  }

  public onParticipantsChanges(participants: User[]): void {
    this.reckoningBoardFacadeService.setParticipants(participants);
  }

  private focusOnInitialTab(tabs: Record<number, Tab>, route: ActivatedRoute): number {
    let initialFocusedTabIndex: number;
    let initialFocusedTab: Tab;
    const firstTab = 0;
    const focusedTabLabel: string = route.snapshot.queryParams.tab;

    if (focusedTabLabel) {
      initialFocusedTab = Object.values(tabs).find(
        (tab: Tab) => tab.queryParam === focusedTabLabel
      );
    }

    if (initialFocusedTab) {
      initialFocusedTabIndex = initialFocusedTab.index;
    } else {
      initialFocusedTabIndex = firstTab;
    }

    return initialFocusedTabIndex;
  }

  private getTabs(): Record<number, Tab> {
    return {
      0: {
        index: 0,
        headerBackgroundColor: 'primary',
        backgroundColor: 'rgba(63, 81, 181, 0.1)',
        queryParam: 'participants'
      },
      1: {
        index: 1,
        headerBackgroundColor: 'accent',
        backgroundColor: 'rgba(255, 64, 129, 0.1)',
        queryParam: 'spendings'
      },
      2: {
        index: 2,
        headerBackgroundColor: 'warn',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        queryParam: 'balance'
      }
    };
  }
}
