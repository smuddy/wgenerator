import {Component, Input} from '@angular/core';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.less'],
  imports: [MatButton, NgIf, FaIconComponent],
})
export class ButtonComponent {
  @Input() public icon: IconProp | null = null;
}
