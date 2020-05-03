import {Injectable} from '@angular/core';
import {Song} from '../../services/song';
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
      flags: new FormControl(song.flags),
      key: new FormControl(song.key),
      tempo: new FormControl(song.tempo),
      type: new FormControl(song.type),
      status: new FormControl(song.status ?? 'draft'),

      legalType: new FormControl(song.legalType),
      legalOwner: new FormControl(song.legalOwner),
      legalOwnerId: new FormControl(song.legalOwnerId),

      artist: new FormControl(song.artist),
      label: new FormControl(song.label),
      termsOfUse: new FormControl(song.termsOfUse),
      origin: new FormControl(song.origin),
    });
  }
}
