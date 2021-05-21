import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {EditComponent} from './edit.component';

@Injectable({
  providedIn: 'root',
})
export class EditSongGuard implements CanDeactivate<unknown> {
  public canDeactivate(
    component: EditComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return component.editSongComponent.askForSave(nextState);
  }
}
