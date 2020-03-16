import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {KeyPipe} from './key.pipe';


@NgModule({
  declarations: [KeyPipe],
  exports: [
    KeyPipe
  ],
  imports: [
    CommonModule
  ]
})
export class KeyTranslatorModule {
}
