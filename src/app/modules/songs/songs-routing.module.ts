import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SongComponent} from './song/song.component';
import {SongListComponent} from './song-list/song-list.component';
import {EditComponent} from './song/edit/edit.component';


const routes: Routes = [
  {
    path: '',
    component: SongListComponent,
    pathMatch: 'full'
  },
  {
    path: ':songId/edit',
    component: EditComponent
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
