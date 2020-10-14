import { Bill } from 'src/app/shared/interfaces/bill.interface';
import { Spending } from 'src/app/shared/interfaces/spending.interface';
import { User } from 'src/app/shared/interfaces/user.interface';
import { StoreService } from 'src/app/shared/store/store.service';
import { ReckoningBoardFacadeService } from './reckoning-board-facade.service';

const provide = (mock: any): any => mock;

describe('Reckoning board facade service', () => {
  let storeService: StoreService;
  let reckoningBoardFacadeService: ReckoningBoardFacadeService;

  beforeEach(() => {
    storeService = new StoreService();
    reckoningBoardFacadeService = new ReckoningBoardFacadeService(provide(storeService));
  });

  it('Tests getBill with empty localStorage', (done: jest.DoneCallback) => {
    reckoningBoardFacadeService.getBill().subscribe((data: Bill) => {
      expect(data).toEqual({ billId: 1, spendingIds: [] });
      done();
    });
  });

  it('Tests getParticipants with empty localStorage', (done: jest.DoneCallback) => {
    reckoningBoardFacadeService.getParticipants().subscribe((data: User[]) => {
      expect(data).toEqual([]);
      done();
    });
  });

  it('Tests getParticipantsRecords with empty localStorage', (done: jest.DoneCallback) => {
    reckoningBoardFacadeService.getParticipantsRecords().subscribe((data: Record<number, User>) => {
      expect(data).toEqual({});
      done();
    });
  });

  it('Tests getSpendings with empty localStorage', (done: jest.DoneCallback) => {
    reckoningBoardFacadeService.getSpendings().subscribe((data: Spending[]) => {
      expect(data).toEqual([]);
      done();
    });
  });

  it('Tests getShares with empty localStorage', (done: jest.DoneCallback) => {
    let dataEmitted = false;
    reckoningBoardFacadeService.getShares().subscribe(() => (dataEmitted = true));

    setTimeout(() => {
      expect(dataEmitted).toEqual(false);
      done();
    }, 1000);
  });
});
