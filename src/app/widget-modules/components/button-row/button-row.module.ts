import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonRowComponent} from './button-row.component';


@NgModule({
  declarations: [ButtonRowComponent],
  exports: [ButtonRowComponent],
  imports: [
    CommonModule
  ]
})
export class ButtonRowModule {
}
