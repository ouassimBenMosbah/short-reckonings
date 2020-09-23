import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { CustomAutoFocusModule } from './../shared/directives/custom-auto-focus/custom-auto-focus.module';
import { BillParticipantsComponent } from './dumbs/bill-participants/bill-participants.component';
import { BillSharesComponent } from './dumbs/bill-shares/bill-shares.component';
import { BillSpendingsComponent } from './dumbs/bill-spendings/bill-spendings.component';
import { ReckoningsRoutingModule } from './reckonings-routing.module';
import { ReckoningBoardComponent } from './smarts/reckoning-board/reckoning-board.component';

@NgModule({
  declarations: [
    ReckoningBoardComponent,
    BillParticipantsComponent,
    BillSpendingsComponent,
    BillSharesComponent
  ],
  imports: [
    CommonModule,
    CustomAutoFocusModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    ReactiveFormsModule,
    ReckoningsRoutingModule
  ]
})
export class ReckoningsModule {}
