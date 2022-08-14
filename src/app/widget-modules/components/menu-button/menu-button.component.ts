import {Component, Input} from '@angular/core';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {faCross} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.less'],
})
export class MenuButtonComponent {
  @Input() public icon: IconProp = faCross;
}
