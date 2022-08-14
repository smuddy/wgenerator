import {Component} from '@angular/core';
import {faChalkboard, faMusic, faPersonBooth, faUserCog} from '@fortawesome/free-solid-svg-icons';
import {fromEvent, Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.less'],
})
export class NavigationComponent {
  public faSongs = faMusic;
  public faShows = faPersonBooth;
  public faUser = faUserCog;
  public faPresentation = faChalkboard;

  public readonly windowScroll$: Observable<number> = fromEvent(window, 'scroll').pipe(
    map(() => window.scrollY),
    startWith(0),
    distinctUntilChanged(),
    shareReplay(1)
  );

  public isNavigationHidden = (scroll: number | null): boolean => (scroll ?? 0) > 60;
}
