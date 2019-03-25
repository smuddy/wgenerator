import { SongsService } from 'src/app/data/songs.service';
import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EditSongService {
  constructor(private songsService: SongsService) {}

  public initEditForm(attachSync: boolean): FormGroup {
    const song = this.songsService.selectedSong.value;
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
      Key: new FormControl(song.Key, { updateOn: 'blur' }),
      Tempo: new FormControl(song.Tempo, { updateOn: 'blur' }),
      Comments: new FormControl(song.Comments, { updateOn: 'blur' }),
    });

    if (attachSync) { this.attachSync(form, song); }

    return form;
  }

    private attachSync(form: FormGroup, song: import("/Users/benjamin/src/wgenerator/WEB/src/app/models/song.model").Song) {
        const controls = Object.keys(form.controls);
        controls.forEach(control => {
            form.controls[control].valueChanges.pipe(switchMap(value => this.songsService.patch(song.ID, control, value))).subscribe();
        });
    }
}
