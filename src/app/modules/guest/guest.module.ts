import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GuestComponent} from './guest.component';
import {RouterModule} from '@angular/router';
import {SongTextModule} from '../../widget-modules/components/song-text/song-text.module';

@NgModule({
  declarations: [GuestComponent],
  imports: [CommonModule, RouterModule.forChild([{path: '', component: GuestComponent}]), SongTextModule],
})
export class GuestModule {}
