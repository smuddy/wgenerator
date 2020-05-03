import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserNameComponent} from './user-name.component';

@NgModule({
  declarations: [UserNameComponent],
  exports: [UserNameComponent],
  imports: [CommonModule]
})
export class UserNameModule {
}
