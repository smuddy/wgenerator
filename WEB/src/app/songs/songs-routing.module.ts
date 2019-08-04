import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SongsComponent} from './components/songs/songs.component';
import {SongResolver} from './song-resolver';


const routes: Routes = [
    {
        path: '',
        component: SongsComponent,
        children: [
            {
                path: 'new',
                loadChildren: () => import('./modules/new/new.module').then(_ => _.NewModule)
            },
            {
                path: ':songId',
                resolve: {
                    song: SongResolver
                },
                runGuardsAndResolvers: 'always',
                children: [
                    {
                        path: '',
                        redirectTo: 'read',
                        pathMatch: 'full',
                    },
                    {
                        path: 'read',
                        loadChildren: () => import('./modules/read/read.module').then(_ => _.ReadModule)
                    },
                    {
                        path: 'edit',
                        loadChildren: () => import('./modules/edit/edit.module').then(_ => _.EditModule)
                    }

                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SongsRoutingModule {
}
