import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from '../../services/user/user.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  public constructor(private userService: UserService, private router: Router) {}

  public canActivate(next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const requiredRoles = next.data.requiredRoles as string[];
    if (!requiredRoles) {
      throw new Error('requiredRoles is not defined!');
    }

    return this.userService.user$.pipe(
      map(user => {
        if (!user) return false;
        const roles = user.role?.split(';') ?? [];
        if (roles.indexOf('admin') !== -1) {
          return true;
        }
        const allowed = roles.some(s => requiredRoles.indexOf(s) !== -1);

        return allowed || this.router.createUrlTree(this.defaultRoute(roles));
      })
    );
  }

  private defaultRoute(roles: string[]): string[] {
    if (!roles || roles.length === 0) {
      return ['brand', 'new-user'];
    }
    switch (roles[0]) {
      case 'user':
        return ['songs'];
      case 'presenter':
        return ['presentation'];
      case 'leader':
        return ['shows'];
    }

    return ['brand', 'new-user'];
  }
}
