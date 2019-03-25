import { FormGroup } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { keys } from './keys';

@Component({
  selector: 'app-song-form',
  templateUrl: './song-form.component.html',
  styleUrls: ['./song-form.component.less']
})
export class SongFormComponent  {
  @Input() public form: FormGroup;
  public keys = keys;
}
