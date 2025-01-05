import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GuestComponent} from './guest.component';
import {RouterModule} from '@angular/router';
import {ShowTypeTranslaterModule} from '../../widget-modules/pipes/show-type-translater/show-type-translater.module';
import {SongTextComponent} from '../../widget-modules/components/song-text/song-text.component';

@NgModule({
  declarations: [GuestComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: ':id',
        component: GuestComponent,
      },
    ]),
    SongTextComponent,
    ShowTypeTranslaterModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GuestModule {}
