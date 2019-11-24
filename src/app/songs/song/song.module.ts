import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SongComponent} from './song.component';
import {CardModule} from '../../widget-modules/components/card/card.module';
import {SongTypeTranslaterModule} from '../../widget-modules/pipes/song-type-translater/song-type-translater.module';



@NgModule({
  declarations: [SongComponent],
  exports: [SongComponent],
  imports: [
    CommonModule,
    CardModule,

    SongTypeTranslaterModule
  ]
})
export class SongModule { }
