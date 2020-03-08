import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListHeaderComponent} from './list-header.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatButtonModule} from '@angular/material/button';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [ListHeaderComponent],
  exports: [
    ListHeaderComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatButtonModule,
    RouterModule
  ]
})
export class ListHeaderModule {
}
