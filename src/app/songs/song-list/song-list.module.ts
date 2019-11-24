import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SongListComponent} from './song-list.component';
import {ListItemComponent} from './list-item/list-item.component';
import {CardModule} from '../../widget-modules/components/card/card.module';
import {SongTypeTranslaterModule} from '../../widget-modules/pipes/song-type-translater/song-type-translater.module';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [SongListComponent, ListItemComponent],
  exports: [SongListComponent],
  imports: [
    CommonModule,
    RouterModule,

    CardModule,
    SongTypeTranslaterModule
  ]
})
export class SongListModule {
}
