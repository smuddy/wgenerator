import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [

    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'songs'
    },
    {
        path: 'songs',
        loadChildren: () => import('./songs/songs.module').then(_ => _.SongsModule)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
