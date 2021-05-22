import {Component, Input} from '@angular/core';
import {Song} from '../../../songs/services/song';
import {Config} from '../../../../services/config';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.less'],
})
export class LegalComponent {
  @Input() public song: Song | null = null;
  @Input() public config: Config | null = null;
}
