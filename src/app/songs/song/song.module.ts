import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SongComponent} from './song.component';
import {CardModule} from '../../widget-modules/components/card/card.module';
import {SongTypeTranslaterModule} from '../../widget-modules/pipes/song-type-translater/song-type-translater.module';
import {MatButtonModule} from '@angular/material/button';
import {ButtonRowModule} from '../../widget-modules/components/button-row/button-row.module';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [SongComponent],
  exports: [SongComponent],
  imports: [
    CommonModule,
    CardModule,
    RouterModule,

    SongTypeTranslaterModule,
    MatButtonModule,
    ButtonRowModule,
  ]
})
export class SongModule {
}
