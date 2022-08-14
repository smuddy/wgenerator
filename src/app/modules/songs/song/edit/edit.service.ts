import {Injectable} from '@angular/core';
import {Song} from '../../services/song';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class EditService {
  public createSongForm(song: Song): UntypedFormGroup {
    return new UntypedFormGroup({
      text: new UntypedFormControl(song.text),
      title: new UntypedFormControl(song.title),
      comment: new UntypedFormControl(song.comment),
      flags: new UntypedFormControl(song.flags),
      key: new UntypedFormControl(song.key),
      tempo: new UntypedFormControl(song.tempo),
      type: new UntypedFormControl(song.type),
      status: new UntypedFormControl(song.status ?? 'draft'),

      legalType: new UntypedFormControl(song.legalType),
      legalOwner: new UntypedFormControl(song.legalOwner),
      legalOwnerId: new UntypedFormControl(song.legalOwnerId),

      artist: new UntypedFormControl(song.artist),
      label: new UntypedFormControl(song.label),
      termsOfUse: new UntypedFormControl(song.termsOfUse),
      origin: new UntypedFormControl(song.origin),
    });
  }
}
