import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SongTypePipe} from './song-type.pipe';

@NgModule({
  declarations: [SongTypePipe],
  exports: [SongTypePipe],
  imports: [CommonModule],
})
export class SongTypeTranslaterModule {}
