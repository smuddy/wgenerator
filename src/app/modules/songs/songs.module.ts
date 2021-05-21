import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SongsRoutingModule} from './songs-routing.module';
import {SongListModule} from './song-list/song-list.module';
import {SongModule} from './song/song.module';
import {EditModule} from './song/edit/edit.module';
import {NewModule} from './song/new/new.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, SongsRoutingModule, SongListModule, SongModule, EditModule, NewModule],
})
export class SongsModule {}
