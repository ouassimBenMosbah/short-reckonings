import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { User } from './../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-bill-participants',
  templateUrl: './bill-participants.component.html',
  styleUrls: ['./bill-participants.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillParticipantsComponent implements OnInit, OnDestroy {
  @Input() participants: User[];

  @Output() participantsChanges: EventEmitter<User[]> = new EventEmitter(null);

  @ViewChildren('nameInputs') nameInputs: QueryList<ElementRef<HTMLInputElement>>;

  private lastUserId: number;

  public billFormGroup: FormGroup;

  public get users(): FormArray {
    return this.billFormGroup.get('users') as FormArray;
  }

  private usersSubscription: Subscription;

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.billFormGroup = new FormGroup({
      users: new FormArray([])
    });

    this.lastUserId = this.participants.reduce(
      (acc, { userId }) => (acc < userId ? userId : acc),
      0
    );

    if (this.participants.length) {
      this.participants.map((p: User) => {
        this.users.push(this.formBuilder.group(p));
      });
    } else {
      this.addParticipant();
    }

    this.usersSubscription = this.users.valueChanges
      .pipe(debounceTime(200))
      .subscribe((users: User[]) => {
        this.participantsChanges.emit(users);
      });
  }

  public ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }

  public addParticipant(): void {
    this.lastUserId++;
    this.users.push(this.createParticipant(this.lastUserId));
  }

  public deleteParticipant(index: number): void {
    this.users.removeAt(index);
  }

  public onClickAddParticipant(): void {
    this.addParticipant();
    setTimeout(() => {
      this.nameInputs.last.nativeElement.focus();
    }, 0);
  }

  private createParticipant(userId: number): FormGroup {
    return this.formBuilder.group({
      userId,
      fullName: '',
      phoneNumber: ''
    });
  }
}
