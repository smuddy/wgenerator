import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {EditComponent} from './edit.component';

@Injectable({
  providedIn: 'root',
})
export class EditSongGuard {
  public canDeactivate(
    component: EditComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return component.editSongComponent ? component.editSongComponent.askForSave(nextState) : true;
  }
}
