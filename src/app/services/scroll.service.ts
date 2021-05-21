import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private scrollPosition: number;
  private scrollSlots: {[key: string]: number} = {};
  private iRestoreScrollPosition$ = new BehaviorSubject<number>(0);
  public restoreScrollPosition$ = this.iRestoreScrollPosition$.asObservable();

  public saveScrollPosition(pos: number): void {
    this.scrollPosition = pos;
  }

  public storeScrollPositionFor(slot: string): void {
    this.scrollSlots[slot] = this.scrollPosition;
  }

  public restoreScrollPositionFor(slot: string): void {
    const pos = this.scrollSlots[slot];
    this.iRestoreScrollPosition$.next(pos);
  }
}
