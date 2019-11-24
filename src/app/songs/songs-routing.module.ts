import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SongComponent} from "./song/song.component";
import {SongListComponent} from "./song-list/song-list.component";


const routes: Routes = [
  {
    path: '',
    component: SongListComponent,
    pathMatch: 'full'
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
