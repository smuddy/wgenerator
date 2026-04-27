import {Component, Input} from '@angular/core';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

import {FaIconComponent} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.less'],
  imports: [FaIconComponent],
  host: {
    '[class.full-width]': 'fullWidth',
  },
})
export class ButtonComponent {
  @Input() public disabled = false;
  @Input() public fullWidth = false;
  @Input() public icon: IconProp | null = null;
}
