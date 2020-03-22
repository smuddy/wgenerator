import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {UserRoutingModule} from './user-routing.module';
import {CardModule} from '../../widget-modules/components/card/card.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {ButtonRowModule} from '../../widget-modules/components/button-row/button-row.module';
import {MatButtonModule} from '@angular/material/button';
import {AuthMessagePipe} from './login/auth-message.pipe';
import {InfoComponent} from './info/info.component';
import {LogoutComponent} from './logout/logout.component';
import {RolePipe} from './info/role.pipe';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  declarations: [LoginComponent, AuthMessagePipe, InfoComponent, LogoutComponent, RolePipe],
  imports: [
    CommonModule,
    UserRoutingModule,
    CardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    ButtonRowModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,


  ]
})
export class UserModule {
}
