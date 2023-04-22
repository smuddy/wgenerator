import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListHeaderComponent} from './list-header.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {RouterModule} from '@angular/router';
import {CardModule} from '../card/card.module';

@NgModule({
  declarations: [ListHeaderComponent],
  exports: [ListHeaderComponent],
  imports: [CommonModule, FontAwesomeModule, MatButtonModule, RouterModule, CardModule],
})
export class ListHeaderModule {}
