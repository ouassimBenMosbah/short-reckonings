import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReckoningBoardComponent } from './smarts/reckoning-board/reckoning-board.component';

const routes: Routes = [{ path: '', component: ReckoningBoardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReckoningsRoutingModule {}
