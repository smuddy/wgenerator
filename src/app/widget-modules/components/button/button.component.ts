import {Component, Input} from '@angular/core';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {MatButton} from '@angular/material/button';

import {FaIconComponent} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.less'],
  imports: [MatButton, FaIconComponent],
})
export class ButtonComponent {
  @Input() public disabled = false;
  @Input() public icon: IconProp | null = null;
}
