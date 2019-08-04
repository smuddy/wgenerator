import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SongEditComponent} from './song-edit/song-edit.component';

const routes: Routes = [{
    path: '',
    pathMatch: 'full',
    component: SongEditComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EditRoutingModule {
}
