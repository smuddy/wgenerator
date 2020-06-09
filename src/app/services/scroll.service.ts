import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private scrollPosition: number;
  private scrollSlots = {};
  private _restoreScrollPosition$ = new BehaviorSubject<number>(0);
  public restoreScrollPosition$ = this._restoreScrollPosition$.asObservable();

  public saveScrollPosition(pos: number) {
    this.scrollPosition = pos;
  }

  public storeScrollPositionFor(slot: string) {
    this.scrollSlots[slot] = this.scrollPosition;
  }

  public restoreScrollPositionFor(slot: string) {
    const pos = this.scrollSlots[slot];
    this._restoreScrollPosition$.next(pos);
  }
}
