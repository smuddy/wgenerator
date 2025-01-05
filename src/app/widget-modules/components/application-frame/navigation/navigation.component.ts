import {Component} from '@angular/core';
import {faChalkboard, faMusic, faPersonBooth, faUserCog} from '@fortawesome/free-solid-svg-icons';
import {fromEvent, Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, startWith} from 'rxjs/operators';
import { BrandComponent } from './brand/brand.component';
import { RouterLink } from '@angular/router';
import { RoleDirective } from '../../../../services/user/role.directive';
import { LinkComponent } from './link/link.component';
import { FilterComponent } from './filter/filter.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.less'],
    imports: [
        BrandComponent,
        RouterLink,
        RoleDirective,
        LinkComponent,
        FilterComponent,
        AsyncPipe,
    ],
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
    shareReplay(1),
  );

  public isNavigationHidden = (scroll: number | null): boolean => (scroll ?? 0) > 60;
}
