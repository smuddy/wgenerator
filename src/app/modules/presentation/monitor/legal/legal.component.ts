import {Component, Input} from '@angular/core';
import {Song} from '../../../songs/services/song';
import {Config} from '../../../../services/config';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-legal',
    templateUrl: './legal.component.html',
    styleUrls: ['./legal.component.less'],
    imports: [NgIf],
})
export class LegalComponent {
  @Input() public song: Song | null = null;
  @Input() public config: Config | null = null;
}
