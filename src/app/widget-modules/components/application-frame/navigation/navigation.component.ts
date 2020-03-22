import {Component} from '@angular/core';
import {faMusic} from '@fortawesome/free-solid-svg-icons/faMusic';
import {faPersonBooth} from '@fortawesome/free-solid-svg-icons/faPersonBooth';
import {faUserCog} from '@fortawesome/free-solid-svg-icons/faUserCog';
import {fromEvent} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.less']
})
export class NavigationComponent {

  public faSongs = faMusic;
  public faShows = faPersonBooth;
  public faUser = faUserCog;

  public readonly windowScroll$ = fromEvent(window, 'scroll').pipe(map(x => window.scrollY), startWith(0), distinctUntilChanged(), shareReplay(1));

}
