import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Share } from './../../../shared/interfaces/share.interface';
import { User } from './../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-bill-shares',
  templateUrl: './bill-shares.component.html',
  styleUrls: ['./bill-shares.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillSharesComponent {
  @Input() shares: Share;
  @Input() participants: Record<number, User>;

  constructor() {}
}
