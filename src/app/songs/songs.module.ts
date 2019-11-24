import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SongsRoutingModule} from './songs-routing.module';
import {SongComponent} from './song/song.component';
import {SongListModule} from './song-list/song-list.module';

@NgModule({
  declarations: [SongComponent],
  imports: [
    CommonModule,
    SongsRoutingModule,
    SongListModule,
  ]
})
export class SongsModule {
}
