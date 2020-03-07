import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShowTypePipe} from './show-type.pipe';


@NgModule({
  declarations: [ShowTypePipe],
  exports: [
    ShowTypePipe
  ],
  imports: [
    CommonModule
  ]
})
export class ShowTypeTranslaterModule {
}
