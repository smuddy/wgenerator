import {Component, inject} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faChalkboard, faMoon, faMusic, faPersonBooth, faQuestion, faSun, faUserCog} from '@fortawesome/free-solid-svg-icons';
import {fromEvent, Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, startWith} from 'rxjs/operators';
import {BrandComponent} from './brand/brand.component';
import {RouterLink} from '@angular/router';
import {RoleDirective} from '../../../../services/user/role.directive';
import {LinkComponent} from './link/link.component';
import {AsyncPipe} from '@angular/common';
import {ThemeService} from '../../../../services/theme/theme.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.less'],
  imports: [BrandComponent, RouterLink, RoleDirective, LinkComponent,  AsyncPipe, MatIconButton, FaIconComponent],
})
export class NavigationComponent {
  public readonly themeService = inject(ThemeService);
  public faSongs = faMusic;
  public faShows = faPersonBooth;
  public faUser = faUserCog;
  public faHelp = faQuestion;
  public faPresentation = faChalkboard;
  public faDarkMode = faMoon;
  public faLightMode = faSun;

  public readonly windowScroll$: Observable<number> = fromEvent(window, 'scroll').pipe(
    map(() => window.scrollY),
    startWith(0),
    distinctUntilChanged(),
    shareReplay(1)
  );

  public isNavigationHidden = (scroll: number | null): boolean => (scroll ?? 0) > 60;
}
