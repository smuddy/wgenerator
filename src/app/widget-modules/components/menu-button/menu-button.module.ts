import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuButtonComponent} from './menu-button.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';

@NgModule({
  declarations: [MenuButtonComponent],
  exports: [MenuButtonComponent],
  imports: [CommonModule, FontAwesomeModule, MatButtonModule],
})
export class MenuButtonModule {}
