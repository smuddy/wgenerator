import {Component, Input} from '@angular/core';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.less'],
})
export class CardComponent {
  @Input() public padding = true;
  @Input() public heading: string;
  @Input() public closeLink: string;

  public faClose = faTimes;
}
