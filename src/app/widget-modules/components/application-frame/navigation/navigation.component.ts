import {Component, OnInit} from '@angular/core';
import {faMusic} from '@fortawesome/free-solid-svg-icons/faMusic';
import {faPersonBooth} from '@fortawesome/free-solid-svg-icons/faPersonBooth';
import {faUserCog} from '@fortawesome/free-solid-svg-icons/faUserCog';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.less']
})
export class NavigationComponent implements OnInit {

  public faSongs = faMusic;
  public faShows = faPersonBooth;
  public faUser = faUserCog;

  constructor() {
  }

  ngOnInit() {
  }

}
