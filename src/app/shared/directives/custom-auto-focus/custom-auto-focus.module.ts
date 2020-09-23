import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomAutofocusDirective } from './custom-auto-focus.directive';

@NgModule({
  declarations: [CustomAutofocusDirective],
  imports: [CommonModule],
  exports: [CustomAutofocusDirective]
})
export class CustomAutoFocusModule {}
