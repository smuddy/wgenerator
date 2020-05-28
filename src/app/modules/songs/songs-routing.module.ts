import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SongComponent} from './song/song.component';
import {SongListComponent} from './song-list/song-list.component';
import {EditComponent} from './song/edit/edit.component';
import {NewComponent} from './song/new/new.component';
import {EditSongGuard} from './song/edit/edit-song.guard';


const routes: Routes = [
  {
    path: '',
    component: SongListComponent,
    pathMatch: 'full'
  },
  {
    path: 'new',
    component: NewComponent
  },
  {
    path: ':songId/edit',
    component: EditComponent,
    canDeactivate: [EditSongGuard]
  },
  {
    path: ':songId',
    component: SongComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SongsRoutingModule {
}
