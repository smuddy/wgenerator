import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SongTextComponent} from './song-text.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';

@NgModule({
  declarations: [SongTextComponent],
  exports: [SongTextComponent],
  imports: [CommonModule, FontAwesomeModule, MatButtonModule],
})
export class SongTextModule {}
