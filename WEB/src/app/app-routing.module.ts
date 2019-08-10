import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './guards/auth.guard';

const routes: Routes = [

    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'songs'
    },
    {
        path: 'songs',
        loadChildren: () => import('./songs/songs.module').then(_ => _.SongsModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'account',
        loadChildren: () => import('./account/account.module').then(_ => _.AccountModule)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
