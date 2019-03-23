import { SongsComponent } from './components/songs/songs.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SongsResolverService } from './data/songs-resolver.service';
import { SongComponent } from './components/song/song.component';
import { SongResolverService } from './data/song-resolver.service';

const routes: Routes = [
  {
    path: 'songs',
    component: SongsComponent,
    resolve: {
      songs: SongsResolverService
    }
  },
  {
    path: 'songs/:id',
    component: SongComponent,
    resolve: {
      song: SongResolverService
    }
  },
  {
    path: '',
    redirectTo: 'songs',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
