import {SongsService} from 'src/app/data/songs.service';
import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {switchMap} from 'rxjs/operators';
import {Song} from '../songs/models/song.model';
import {Subscription} from 'rxjs';
import {File} from '../songs/models/file.model';

@Injectable({
    providedIn: 'root'
})
export class EditSongService {

    constructor(private songsService: SongsService) {
    }

    public initSongEditForm(attachSync: boolean, _song: Song): FormGroup {
        const song = attachSync
            ? _song
            : this.defaultValues();
        const form = new FormGroup({
            Number: new FormControl(song.Number, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.min(1)]
            }),
            Name: new FormControl(song.Name, {
                updateOn: 'blur',
                validators: Validators.required
            }),
            Text: new FormControl(song.Text, {updateOn: 'blur'}),
            SongType: new FormControl(song.SongType, {
                updateOn: 'blur',
                validators: Validators.required
            }),
            Key: new FormControl(song.Key, {
                updateOn: 'blur',
                validators: Validators.required
            }),
            Tempo: new FormControl(song.Tempo, {updateOn: 'blur'}),
            Comments: new FormControl(song.Comments, {updateOn: 'blur'})
        });

        if (attachSync) {
            this.attachSync(form, song);
        }

        return form;
    }

    public initFileEditForm(songId: number, file: File): { form: FormGroup, changeSubscription: Subscription } {
        const form = new FormGroup({
            Name: new FormControl(file.Name, {
                updateOn: 'blur',
                validators: Validators.required
            }),
            FileType: new FormControl(file.FileType, {
                updateOn: 'blur'
            })
        });

        const changeSubscription = form.valueChanges.pipe(
            switchMap(_ => this.songsService.updateFile$(songId, file.ID, _.Name, _.FileType)),
        ).subscribe();

        return {form: form, changeSubscription: changeSubscription};
    }

    private attachSync(form: FormGroup, song: Song) {
        const controls = Object.keys(form.controls);
        controls.forEach(control => {
            form.controls[control].valueChanges
                .pipe(
                    switchMap(value => this.songsService.patch$(song.ID, control, value)),
                )
                .subscribe();
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
            Final: false,
            Files: []
        };

        return song;
    }

    private firstFreeNumber(): number {
        let number = 0;
        const numbers = this.songsService.songs.value.map(_ => _.Number);
        while (numbers.indexOf(++number) !== -1) {
        }
        return number;
    }
}
