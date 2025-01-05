import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SongsRoutingModule} from './songs-routing.module';

import {EditModule} from './song/edit/edit.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, SongsRoutingModule, EditModule],
})
export class SongsModule {}
