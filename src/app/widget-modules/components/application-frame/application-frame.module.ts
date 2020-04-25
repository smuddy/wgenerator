import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationComponent} from './navigation/navigation.component';
import {RouterModule} from '@angular/router';
import {FilterComponent} from './navigation/filter/filter.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {LinkComponent} from './navigation/link/link.component';
import {FormsModule} from '@angular/forms';
import {RoleModule} from '../../../services/user/role.module';

@NgModule({
  declarations: [
    NavigationComponent,
    FilterComponent,
    LinkComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    FormsModule,
    RoleModule
  ],
  exports: [
    NavigationComponent
  ]
})
export class ApplicationFrameModule {
}
