import {NgModule} from '@angular/core';
import {OwnerDirective} from './owner.directive';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [OwnerDirective],
  exports: [OwnerDirective],
  imports: [CommonModule],
})
export class OwnerModule {}
