import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NewComponent} from './new.component';
import {CardModule} from '../../../../widget-modules/components/card/card.module';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ButtonRowModule} from '../../../../widget-modules/components/button-row/button-row.module';
import {ButtonModule} from '../../../../widget-modules/components/button/button.module';
import {AutofocusModule} from '../../../../widget-modules/directives/autofocus/autofocus.module';

@NgModule({
  declarations: [NewComponent],
  imports: [CommonModule, CardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, ButtonRowModule, ButtonModule, AutofocusModule],
})
export class NewModule {}
