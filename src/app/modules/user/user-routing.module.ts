import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {InfoComponent} from './info/info.component';
import {LogoutComponent} from './logout/logout.component';
import {AngularFireAuthGuard, redirectUnauthorizedTo} from '@angular/fire/compat/auth-guard';
import {PasswordComponent} from './password/password.component';
import {PasswordSendComponent} from './password-send/password-send.component';
import {NewComponent} from './new/new.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'info',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'logout',
    component: LogoutComponent,
  },
  {
    path: 'password',
    component: PasswordComponent,
  },
  {
    path: 'new',
    component: NewComponent,
  },
  {
    path: 'password-send',
    component: PasswordSendComponent,
  },
  {
    path: 'info',
    component: InfoComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: () => redirectUnauthorizedTo(['user', 'login'])},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
