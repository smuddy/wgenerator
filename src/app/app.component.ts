import {Component, OnInit} from '@angular/core';
import {fader} from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  animations: [fader]
})
export class AppComponent implements OnInit {
  public static hideLoader = () => document.querySelector('#load-bg').classList.add('hidden');

  public ngOnInit(): void {
    setTimeout(() => AppComponent.hideLoader(), 800);

  }
}
