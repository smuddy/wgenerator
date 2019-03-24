import { Song } from 'src/app/models/song.model';
import { SongsService } from 'src/app/data/songs.service';
import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class EditSongService {

    constructor(private songsService: SongsService) { }

    public initEditForm(): FormGroup {
        const song = this.songsService.selectedSong.value;
        const form = new FormGroup({
            ID: new FormControl(song.ID),
            Number: new FormControl(song.Number),
            Name: new FormControl(song.Name, Validators.required),
            Text: new FormControl(song.Text),
            SongType: new FormControl(song.SongType, Validators.required),
            Key: new FormControl(song.Key),
            Tempo: new FormControl(song.Tempo)
        });

        return form;
    }
}
