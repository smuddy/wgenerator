import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RoleDirective} from './role.directive';

@NgModule({
  declarations: [RoleDirective],
  exports: [RoleDirective],
  imports: [
    CommonModule
  ]
})
export class RoleModule {
}
