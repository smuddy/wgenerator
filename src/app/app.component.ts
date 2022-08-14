import {Component, OnInit, ViewChild} from '@angular/core';
import {fader} from './animations';
import {ScrollService} from './services/scroll.service';
import {PerfectScrollbarComponent} from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  animations: [fader],
})
export class AppComponent implements OnInit {
  @ViewChild('scrollbar', {static: false}) public scrollbar: PerfectScrollbarComponent | null = null;

  public constructor(private scrollService: ScrollService) {
    scrollService.restoreScrollPosition$.subscribe(pos => {
      if (this.scrollbar && pos) this.scrollbar.directiveRef?.scrollTo(0, pos, 300);
    });
  }

  public static hideLoader: () => void = () => document.querySelector('#load-bg')?.classList.add('hidden');

  public ngOnInit(): void {
    setTimeout(() => AppComponent.hideLoader(), 2000);
  }

  public onScoll($event: {srcElement: {scrollTop: number}}): void {
    this.scrollService.saveScrollPosition($event.srcElement.scrollTop);
  }
}
