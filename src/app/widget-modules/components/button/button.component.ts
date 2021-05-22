import {Component, Input} from '@angular/core';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {faCross} from '@fortawesome/free-solid-svg-icons/faCross';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.less'],
})
export class ButtonComponent {
  @Input() public icon: IconProp = faCross;
}
