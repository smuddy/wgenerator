import { SongsService } from 'src/app/data/songs.service';
import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { Song } from '../models/song.model';

@Injectable({
  providedIn: 'root'
})
export class EditSongService {
  constructor(private songsService: SongsService) {}

  public initEditForm(attachSync: boolean): FormGroup {
    const song = attachSync ? this.songsService.selectedSong.value : this.defaultValues();
    const form = new FormGroup({
      Number: new FormControl(song.Number, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      Name: new FormControl(song.Name, {
        updateOn: 'blur',
        validators: Validators.required
      }),
      Text: new FormControl(song.Text, { updateOn: 'blur' }),
      SongType: new FormControl(song.SongType, {
        updateOn: 'blur',
        validators: Validators.required
      }),
      Key: new FormControl(song.Key, {
        updateOn: 'blur',
        validators: Validators.required
      }),
      Tempo: new FormControl(song.Tempo, { updateOn: 'blur' }),
      Comments: new FormControl(song.Comments, { updateOn: 'blur' }),
    });

    if (attachSync) { this.attachSync(form, song); }

    return form;
  }

    private attachSync(form: FormGroup, song: Song) {
        const controls = Object.keys(form.controls);
        controls.forEach(control => {
            form.controls[control].valueChanges.pipe(switchMap(value => this.songsService.patch(song.ID, control, value))).subscribe();
        });
    }

    private defaultValues(): Song {
      const song: Song = {
        ID: null,
        Number: this.firstFreeNumber(),
        Name: null,
        Tempo: null,
        Text: null,
        SongType: null,
        Key: null,
        Comments: null,
        Final: false
      };

      return song;
    }

    private firstFreeNumber(): number {
      let number = 0;
      const numbers = this.songsService.songs.value.map(_ => _.Number);
      while (numbers.indexOf(++number) !== -1) { }
      return number;
    }
}
