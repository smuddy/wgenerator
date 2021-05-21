import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardComponent} from './card.component';
import {MatButtonModule} from '@angular/material/button';
import {RouterModule} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [CardComponent],
  exports: [CardComponent],
  imports: [CommonModule, MatButtonModule, RouterModule, FontAwesomeModule],
})
export class CardModule {}
