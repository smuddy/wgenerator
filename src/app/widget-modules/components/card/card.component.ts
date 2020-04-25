import {Component, Input} from '@angular/core';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.less']
})
export class CardComponent {
  @Input() padding = true;
  @Input() heading: string;
  @Input() closeLink: string;

  public faClose = faTimes;
}
