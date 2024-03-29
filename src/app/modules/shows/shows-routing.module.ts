import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NewComponent} from './new/new.component';
import {ListComponent} from './list/list.component';
import {ShowComponent} from './show/show.component';
import {EditComponent} from './edit/edit.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ListComponent,
  },
  {
    path: 'new',
    component: NewComponent,
  },
  {
    path: ':showId/edit',
    component: EditComponent,
  },
  {
    path: ':showId',
    component: ShowComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowsRoutingModule {}
