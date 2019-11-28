import {Injectable} from '@angular/core';
import {Song} from '../../models/song';
import {FormControl, FormGroup} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class EditService {

  constructor() {
  }

  public createSongForm(song: Song): FormGroup {
    return new FormGroup({
      text: new FormControl(song.text),
      title: new FormControl(song.title),
      comment: new FormControl(song.comment),
      key: new FormControl(song.key),
      tempo: new FormControl(song.tempo),
      type: new FormControl(song.type)
    });
  }
}
