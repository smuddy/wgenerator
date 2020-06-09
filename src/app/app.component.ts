import {Component, OnInit, ViewChild} from '@angular/core';
import {fader} from './animations';
import {ScrollService} from './services/scroll.service';
import {PerfectScrollbarComponent} from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  animations: [fader]
})
export class AppComponent implements OnInit {
  public static hideLoader = () => document.querySelector('#load-bg').classList.add('hidden');
  @ViewChild('scrollbar', {static: false}) scrollbar: PerfectScrollbarComponent;

  constructor(private scrollService: ScrollService) {
    scrollService.restoreScrollPosition$.subscribe(pos => {
      if (this.scrollbar && pos) {
        //this.scrollbar.scrollTo(pos, 0);
        this.scrollbar.directiveRef.scrollTo(0, pos, 300)
        // debugger;
      }
    })
  }

  public ngOnInit(): void {
    setTimeout(() => AppComponent.hideLoader(), 800);

  }

  onScoll($event: { srcElement: { scrollTop: number } }) {
    this.scrollService.saveScrollPosition($event.srcElement.scrollTop);
  }
}
