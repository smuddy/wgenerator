import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AngularFireAuthGuard, redirectUnauthorizedTo} from '@angular/fire/compat/auth-guard';
import {RoleGuard} from './widget-modules/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'songs',
    pathMatch: 'full',
  },
  {
    path: 'songs',
    loadChildren: () => import('./modules/songs/songs.module').then(m => m.SongsModule),
    canActivate: [AngularFireAuthGuard, RoleGuard],
    data: {
      authGuardPipe: () => redirectUnauthorizedTo(['user', 'login']),
      requiredRoles: ['user'],
    },
  },
  {
    path: 'shows',
    loadChildren: () => import('./modules/shows/shows.module').then(m => m.ShowsModule),
    canActivate: [AngularFireAuthGuard, RoleGuard],
    data: {
      authGuardPipe: () => redirectUnauthorizedTo(['user', 'login']),
      requiredRoles: ['leader', 'member'],
    },
  },
  {
    path: 'presentation',
    loadChildren: () => import('./modules/presentation/presentation.module').then(m => m.PresentationModule),
    canActivate: [AngularFireAuthGuard, RoleGuard],
    data: {
      authGuardPipe: () => redirectUnauthorizedTo(['user', 'login']),
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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      // relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
