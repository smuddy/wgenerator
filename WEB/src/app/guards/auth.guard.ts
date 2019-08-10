import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Role} from '../services/roles.model';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService,
                private router: Router
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        return this.authService.userMay$(Role.reader).pipe(
            map(_ => {
                return _
                    ? true
                    : this.router.createUrlTree(['/account/login'], {queryParams: {redirect: route.url}});
            })
        );
    }
}
