import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RemoteComponent} from './remote/remote.component';
import {MonitorComponent} from './monitor/monitor.component';
import {SelectComponent} from './select/select.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'remote',
  },
  {
    path: 'remote',
    component: RemoteComponent,
  },
  {
    path: 'select',
    component: SelectComponent,
  },
  {
    path: 'monitor',
    component: MonitorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PresentationRoutingModule {}
