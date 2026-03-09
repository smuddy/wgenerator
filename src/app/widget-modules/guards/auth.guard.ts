import {Injectable} from '@angular/core';
import {CanActivate, Router, UrlTree} from '@angular/router';
import {Auth, authState} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  public constructor(
    private auth: Auth,
    private router: Router
  ) {}

  public canActivate(): Observable<boolean | UrlTree> {
    return authState(this.auth).pipe(
      take(1),
      map(user => (user ? true : this.router.createUrlTree(['user', 'login'])))
    );
  }
}
