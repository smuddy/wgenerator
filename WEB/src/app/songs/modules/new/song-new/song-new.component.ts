import {EditSongService} from '../../../../data/edit-song.service';
import {FormGroup} from '@angular/forms';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {faLongArrowAltLeft, faSave} from '@fortawesome/free-solid-svg-icons';
import {SongsService} from 'src/app/data/songs.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-song-new',
    templateUrl: './song-new.component.html',
    styleUrls: ['./song-new.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SongNewComponent implements OnInit {
    public faArrow = faLongArrowAltLeft;
    public faSave = faSave;
    public form: FormGroup;

    constructor(
        private editSongService: EditSongService,
        private songsService: SongsService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.form = this.editSongService.initSongEditForm(false, null);
    }

    public onClickAdd(): void {
        this.songsService.saveNewSong$(this.form.value).subscribe(song => {
            this.router.navigateByUrl('/songs/' + song.ID + '/read');
        });
    }

}
