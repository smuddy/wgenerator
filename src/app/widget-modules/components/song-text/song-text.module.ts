import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SongTextComponent} from './song-text.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [SongTextComponent],
  exports: [SongTextComponent],
  imports: [
    CommonModule,
    FontAwesomeModule
  ]
})
export class SongTextModule {
}
