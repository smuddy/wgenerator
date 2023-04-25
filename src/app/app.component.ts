import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {fader} from './animations';
import {ScrollService} from './services/scroll.service';
import {PerfectScrollbarComponent} from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  animations: [fader],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  @ViewChild('scrollbar', {static: false}) public scrollbar: PerfectScrollbarComponent | null = null;

  public constructor(private scrollService: ScrollService) {
    scrollService.restoreScrollPosition$.subscribe(pos => {
      if (this.scrollbar && pos) this.scrollbar.directiveRef?.scrollTo(0, pos, 300);
    });
  }

  public ngOnInit(): void {
    setTimeout(() => document.querySelector('#load-bg')?.classList.add('hidden'), 1000);
    setTimeout(() => document.querySelector('#load-bg')?.remove(), 5000);
  }

  public onScoll($event: {srcElement: {scrollTop: number}}): void {
    this.scrollService.saveScrollPosition($event.srcElement.scrollTop);
  }
}
