import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from './button.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [ButtonComponent],
  exports: [
    ButtonComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatButtonModule
  ]
})
export class ButtonModule {
}
