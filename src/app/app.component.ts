import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {fader} from './animations';
import {ScrollService} from './services/scroll.service';
import {register} from 'swiper/element/bundle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  animations: [fader],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  public constructor(private scrollService: ScrollService) {
    register();
  }

  public ngOnInit(): void {
    setTimeout(() => document.querySelector('#load-bg')?.classList.add('hidden'), 1000);
    setTimeout(() => document.querySelector('#load-bg')?.remove(), 5000);
  }

  public onScoll($event: {srcElement: {scrollTop: number}}): void {
    this.scrollService.saveScrollPosition($event.srcElement.scrollTop);
  }
}
