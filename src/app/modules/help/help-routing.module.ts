import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HelpComponent} from './help/help';

const routes: Routes = [
  {
    path: '',
    component: HelpComponent,
    pathMatch: 'full',

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpRoutingModule {}
