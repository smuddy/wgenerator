import {Component, Input} from '@angular/core';
import {Song} from '../../services/song';
import {faBalanceScaleRight} from '@fortawesome/free-solid-svg-icons/faBalanceScaleRight';
import {faPencilRuler} from '@fortawesome/free-solid-svg-icons/faPencilRuler';
import {faCheck} from '@fortawesome/free-solid-svg-icons/faCheck';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.less'],
})
export class ListItemComponent {
  @Input() public song: Song;
  public faLegal = faBalanceScaleRight;
  public faDraft = faPencilRuler;
  public faFinal = faCheck;
}
