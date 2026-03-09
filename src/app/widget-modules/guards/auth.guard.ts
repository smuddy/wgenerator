import {EnvironmentInjector, Injectable, inject, runInInjectionContext} from '@angular/core';
import {CanActivate, Router, UrlTree} from '@angular/router';
import {Auth, authState} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private auth = inject(Auth);
  private router = inject(Router);
  private environmentInjector = inject(EnvironmentInjector);

  public canActivate(): Observable<boolean | UrlTree> {
    return runInInjectionContext(this.environmentInjector, () => authState(this.auth)).pipe(
      take(1),
      map(user => (user ? true : this.router.createUrlTree(['user', 'login'])))
    );
  }
}
