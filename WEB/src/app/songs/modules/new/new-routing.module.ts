import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SongNewComponent} from './song-new/song-new.component';

const routes: Routes = [{
    path: '',
    pathMatch: 'full',
    component: SongNewComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewRoutingModule {
}
