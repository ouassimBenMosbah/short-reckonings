import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Share } from './../../../shared/interfaces/share.interface';
import { Spending } from './../../../shared/interfaces/spending.interface';
import { User } from './../../../shared/interfaces/user.interface';
import { ReckoningBoardFacadeService } from './../../services/reckoning-board-facade.service';

@Component({
  selector: 'app-reckoning-board',
  templateUrl: './reckoning-board.component.html',
  styleUrls: ['./reckoning-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReckoningBoardComponent implements OnInit {
  public obsInitial$: Observable<{ participants$: User[]; spendings$: Spending[] }>;
  public obsRes$: Observable<{ shares$: Share; participantsRecord$: Record<number, User> }>;

  constructor(private reckoningBoardFacadeService: ReckoningBoardFacadeService) {}

  public ngOnInit(): void {
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

  public onSpendingsChanges(spendings: Spending[]): void {
    this.reckoningBoardFacadeService.setSpendings(spendings);
  }

  public onParticipantsChanges(participants: User[]): void {
    this.reckoningBoardFacadeService.setParticipants(participants);
  }
}
