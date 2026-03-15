import {Injectable, inject} from '@angular/core';
import {ActivatedRouteSnapshot, Router, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from '../../services/user/user.service';
import {map, take} from 'rxjs/operators';
import {roles} from '../../services/user/roles';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard {
  private userService = inject(UserService);
  private router = inject(Router);

  public canActivate(next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const requiredRoles = next.data.requiredRoles as string[];
    if (!requiredRoles) {
      throw new Error('requiredRoles is not defined!');
    }

    return this.userService.user$.pipe(
      take(1),
      map(user => {
        if (!user) {
          return this.router.createUrlTree(['brand', 'new-user']);
        }
        const userRoles = this.parseRoles(user.role);
        if (userRoles.includes('admin')) {
          return true;
        }
        const allowed = userRoles.some(role => requiredRoles.includes(role));

        return allowed || this.router.createUrlTree(this.defaultRoute(userRoles));
      })
    );
  }

  private defaultRoute(userRoles: roles[]): string[] {
    if (userRoles.length === 0) {
      return ['brand', 'new-user'];
    }

    if (userRoles.includes('user') || userRoles.includes('contributor')) {
      return ['songs'];
    }

    if (userRoles.includes('leader') || userRoles.includes('member')) {
      return ['shows'];
    }

    if (userRoles.includes('presenter')) {
      return ['presentation'];
    }

    return ['user', 'info'];
  }

  private parseRoles(role: string | null | undefined): roles[] {
    if (!role) {
      return [];
    }

    return role
      .split(';')
      .map(value => value.trim())
      .filter((value): value is roles => value.length > 0 && value !== 'none');
  }
}
