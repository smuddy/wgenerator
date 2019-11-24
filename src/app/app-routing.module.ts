import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'songs',
    pathMatch: 'full'
  },
  {
    path: 'songs',
    loadChildren: () => import('./songs/songs.module').then(m => m.SongsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
