import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GuestComponent} from './guest.component';
import {RouterModule} from '@angular/router';
import {SongTextComponent} from '../../widget-modules/components/song-text/song-text.component';
import {ShowTypePipe} from '../../widget-modules/pipes/show-type-translater/show-type.pipe';

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
    ShowTypePipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GuestModule {}
