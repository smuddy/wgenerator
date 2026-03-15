import {Component, Input} from '@angular/core';

export type BadgeType = 'ok' | 'warn' | 'error' | 'none';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.less'],
  standalone: true,
})
export class BadgeComponent {
  @Input() public type: BadgeType = 'none';
}
