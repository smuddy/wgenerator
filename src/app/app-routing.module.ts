import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FirebaseApp} from '@angular/fire/app';
import {provideStorage} from '@angular/fire/storage';
import {inject} from '@angular/core';
import {getStorage} from 'firebase/storage';
import {RoleGuard} from './widget-modules/guards/role.guard';
import {AuthGuard} from './widget-modules/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'songs',
    pathMatch: 'full',
  },
  {
    path: 'songs',
    loadChildren: () => import('./modules/songs/songs.module').then(m => m.SongsModule),
    providers: [provideStorage(() => getStorage(inject(FirebaseApp)))],
    canActivate: [AuthGuard, RoleGuard],
    data: {
      requiredRoles: ['user'],
    },
  },
  {
    path: 'shows',
    loadChildren: () => import('./modules/shows/shows.module').then(m => m.ShowsModule),
    canActivate: [AuthGuard, RoleGuard],
    data: {
      requiredRoles: ['leader', 'member'],
    },
  },
  {
    path: 'presentation',
    loadChildren: () => import('./modules/presentation/presentation.module').then(m => m.PresentationModule),
    canActivate: [AuthGuard, RoleGuard],
    data: {
      requiredRoles: ['presenter'],
    },
  },
  {
    path: 'user',
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule),
  },
  {
    path: 'brand',
    loadChildren: () => import('./modules/brand/brand.module').then(m => m.BrandModule),
  },
  {
    path: 'guest',
    loadChildren: () => import('./modules/guest/guest.module').then(m => m.GuestModule),
  },
  {
    path: 'help',
    loadChildren: () => import('./modules/help/help.module').then(m => m.HelpModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      // relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
