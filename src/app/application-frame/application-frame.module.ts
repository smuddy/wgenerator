import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationComponent} from './navigation/navigation.component';
import {RouterModule} from '@angular/router';
import {FilterComponent} from './navigation/filter/filter.component';


@NgModule({
  declarations: [
    NavigationComponent,
    FilterComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    NavigationComponent
  ]
})
export class ApplicationFrameModule {
}
