import {Component, Input} from '@angular/core';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {faCross} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.less'],
})
export class LinkComponent {
  @Input() public text: string | null = null;
  @Input() public link: string | null = null;
  @Input() public icon: IconProp = faCross;
}
