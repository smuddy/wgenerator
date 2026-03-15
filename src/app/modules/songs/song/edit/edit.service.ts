import {Injectable} from '@angular/core';
import {Song} from '../../services/song';
import {FormControl, FormGroup} from '@angular/forms';

export type SongFormGroup = FormGroup<{
  text: FormControl<string>;
  title: FormControl<string>;
  comment: FormControl<string>;
  flags: FormControl<string>;
  key: FormControl<string>;
  tempo: FormControl<number>;
  type: FormControl<Song['type']>;
  status: FormControl<Song['status']>;
  legalType: FormControl<Song['legalType']>;
  legalOwner: FormControl<Song['legalOwner']>;
  legalOwnerId: FormControl<string>;
  artist: FormControl<string>;
  label: FormControl<string>;
  termsOfUse: FormControl<string>;
  origin: FormControl<string>;
}>;

@Injectable({
  providedIn: 'root',
})
export class EditService {
  public createSongForm(song: Song): SongFormGroup {
    return new FormGroup({
      text: new FormControl(song.text, {nonNullable: true}),
      title: new FormControl(song.title, {nonNullable: true}),
      comment: new FormControl(song.comment, {nonNullable: true}),
      flags: new FormControl(song.flags, {nonNullable: true}),
      key: new FormControl(song.key, {nonNullable: true}),
      tempo: new FormControl(song.tempo, {nonNullable: true}),
      type: new FormControl(song.type, {nonNullable: true}),
      status: new FormControl(song.status ?? 'draft', {nonNullable: true}),

      legalType: new FormControl(song.legalType, {nonNullable: true}),
      legalOwner: new FormControl(song.legalOwner, {nonNullable: true}),
      legalOwnerId: new FormControl(song.legalOwnerId, {nonNullable: true}),

      artist: new FormControl(song.artist, {nonNullable: true}),
      label: new FormControl(song.label, {nonNullable: true}),
      termsOfUse: new FormControl(song.termsOfUse, {nonNullable: true}),
      origin: new FormControl(song.origin, {nonNullable: true}),
    });
  }
}
