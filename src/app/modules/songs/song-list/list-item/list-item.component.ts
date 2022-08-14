import {Component, Input} from '@angular/core';
import {Song} from '../../services/song';
import {faBalanceScaleRight, faCheck, faPencilRuler} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.less'],
})
export class ListItemComponent {
  @Input() public song: Song | null = null;
  public faLegal = faBalanceScaleRight;
  public faDraft = faPencilRuler;
  public faFinal = faCheck;
}
