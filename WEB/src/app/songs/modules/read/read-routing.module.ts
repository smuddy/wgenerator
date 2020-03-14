import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SongComponent} from './song/song.component';

const routes: Routes = [{
    path: '',
    pathMatch: 'full',
    component: SongComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReadRoutingModule {
}