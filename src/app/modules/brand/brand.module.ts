import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrandComponent} from './brand.component';
import {RouterModule, Routes} from '@angular/router';
import {LogoModule} from '../../widget-modules/components/logo/logo.module';
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
  declarations: [BrandComponent, NewUserComponent],
  imports: [CommonModule, RouterModule.forChild(routes), LogoModule],
})
export class BrandModule {}
