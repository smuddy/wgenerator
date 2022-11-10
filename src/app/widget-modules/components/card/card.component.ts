import {Component, Input} from '@angular/core';
import {faTimes} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.less'],
})
export class CardComponent {
  @Input() public padding = true;
  @Input() public heading: string | null = null;
  @Input() public subheading: string | null = null;
  @Input() public closeLink: string | null = null;
  @Input() public closeIcon = faTimes;
}
