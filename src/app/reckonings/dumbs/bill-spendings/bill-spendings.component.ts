import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { merge, Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Spending } from './../../../shared/interfaces/spending.interface';
import { User } from './../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-bill-spendings',
  templateUrl: './bill-spendings.component.html',
  styleUrls: ['./bill-spendings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillSpendingsComponent implements OnInit, OnChanges {
  @Input() spendings: Spending[];
  @Input() participants: User[];

  @Output() spendingsChanges: EventEmitter<Spending[]> = new EventEmitter(null);

  @ViewChildren('descriptionInputs') descriptionInputs: QueryList<ElementRef<HTMLInputElement>>;

  public filteredParticipants$: Observable<User[]>[] = [];
  public billFormGroup: FormGroup;

  private participantsChanges: Subject<User[]> = new Subject();
  private lastSpendingId: number;

  public get spendingsFA(): FormArray {
    return this.billFormGroup.get('spendings') as FormArray;
  }

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.billFormGroup = new FormGroup({
      spendings: new FormArray([])
    });

    this.lastSpendingId = this.spendings.reduce(
      (acc, { spendingId }) => (acc < spendingId ? spendingId : acc),
      0
    );

    this.spendings.map((spending) => {
      this.spendingsFA.push(
        this.formBuilder.group({
          ...spending,
          usersConcernedIds: [
            spending.usersConcernedIds.length === this.participants.length
              ? spending.usersConcernedIds.concat(0)
              : spending.usersConcernedIds,
            Validators.required
          ] || [[], Validators.required]
        })
      );
    });

    this.manageUserIdsFilters();
    this.subscribeToValueChanges();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.participants) {
      this.participantsChanges.next(changes.participants.currentValue);
    }
  }

  public displayUserFn(userId: number): string {
    return this.participants.find((p) => p.userId === userId)?.fullName || '';
  }

  public deleteSpending(index: number): void {
    this.spendingsFA.removeAt(index);
    this.filteredParticipants$.splice(index, 1);
  }

  public addSpending(): void {
    this.lastSpendingId++;
    this.spendingsFA.push(this.createSpending(this.lastSpendingId));
    this.manageOneUserIdFilter(this.spendings.length);
  }

  public onClickAddSpending(): void {
    this.addSpending();
    setTimeout(() => {
      this.descriptionInputs.last.nativeElement.focus();
    }, 0);
  }

  public toggleSelection(i: number): void {
    const formControl: AbstractControl = this.spendingsFA
      .get(i.toString())
      .get('usersConcernedIds');
    if (formControl.value.length === this.participants.length) {
      formControl.reset([]);
    } else {
      formControl.setValue(this.participants.map(({ userId }) => userId).concat(0));
    }
  }

  public onSelectionChange(event: MatOptionSelectionChange, index: number): void {
    if (event.isUserInput) {
      const formControl: AbstractControl = this.spendingsFA
        .get(index.toString())
        .get('usersConcernedIds');
      if (!event.source.selected) {
        formControl.patchValue(formControl.value.filter((id) => id > 0));
        event.source.deselect();
      } else if (formControl.value.length + 1 === this.participants.length) {
        formControl.patchValue(formControl.value.concat(0));
        event.source.select();
      }
    }
  }

  private manageUserIdsFilters(): void {
    for (let i = 0; i < this.spendings.length; i++) {
      this.manageOneUserIdFilter(i);
    }
  }

  private manageOneUserIdFilter(index: number): void {
    this.filteredParticipants$[index] = merge(
      this.spendingsFA.controls[index].get('userId').valueChanges,
      this.participantsChanges
        .asObservable()
        .pipe(map(() => this.spendingsFA.controls[index]?.get('userId')?.value || ''))
    ).pipe(
      startWith<string | User>(''),
      map((value: string | User) => (typeof value === 'string' ? value : value.fullName)),
      map((name: string) => (name ? this.filterUsersByName(name) : this.participants.slice()))
    );
  }

  private filterUsersByName(name: string): User[] {
    const filterValue: string = name.toLowerCase();

    return this.participants.filter((participant: User) =>
      participant.fullName.toLowerCase().includes(filterValue)
    );
  }

  private subscribeToValueChanges(): void {
    this.spendingsFA.valueChanges.subscribe((spendings: Spending[]) => {
      this.spendingsChanges.emit(
        spendings
          .filter((spending) => {
            return spending.userId && spending.usersConcernedIds.length;
          })
          .map((spending) => {
            return {
              ...spending,
              usersConcernedIds: spending.usersConcernedIds.filter((id) => id > 0)
            };
          })
      );
    });
  }

  private createSpending(spendingId: number): FormGroup {
    return this.formBuilder.group({
      spendingId,
      description: ['', Validators.required],
      total: [null, Validators.required],
      userId: [null, Validators.required],
      usersConcernedIds: [[], Validators.required]
    });
  }
}
