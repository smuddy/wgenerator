import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrandComponent} from './brand.component';
import {RouterModule, Routes} from '@angular/router';

import {NewUserComponent} from './new-user/new-user.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: BrandComponent,
  },
  {
    path: 'new-user',
    component: NewUserComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), BrandComponent, NewUserComponent],
})
export class BrandModule {}
