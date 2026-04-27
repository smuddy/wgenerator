import {ChangeDetectionStrategy, Component, OnInit, inject} from '@angular/core';
import {fader} from './animations';
import {RouterOutlet} from '@angular/router';
import {NavigationComponent} from './widget-modules/components/application-frame/navigation/navigation.component';
import {ThemeService} from './services/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  animations: [fader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, NavigationComponent],
})
export class AppComponent implements OnInit {
  public constructor() {
    inject(ThemeService);
  }

  public ngOnInit(): void {
    setTimeout(() => document.querySelector('#load-bg')?.classList.add('hidden'), 1000);
    setTimeout(() => document.querySelector('#load-bg')?.remove(), 5000);
  }
}
