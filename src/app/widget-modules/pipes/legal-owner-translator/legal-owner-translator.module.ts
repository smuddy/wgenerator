import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LegalOwnerPipe} from './legal-owner.pipe';


@NgModule({
  declarations: [LegalOwnerPipe],
  exports: [
    LegalOwnerPipe
  ],
  imports: [
    CommonModule
  ]
})
export class LegalOwnerTranslatorModule {
}
