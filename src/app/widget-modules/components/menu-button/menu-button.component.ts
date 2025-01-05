import {Component, Input} from '@angular/core';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {faCross} from '@fortawesome/free-solid-svg-icons';
import {MatButton} from '@angular/material/button';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.less'],
  imports: [MatButton, FaIconComponent],
})
export class MenuButtonComponent {
  @Input() public icon: IconProp = faCross;
}
