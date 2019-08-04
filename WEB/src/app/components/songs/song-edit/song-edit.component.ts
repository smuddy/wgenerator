import {SongsService} from 'src/app/data/songs.service';
import {FormGroup} from '@angular/forms';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {EditSongService} from 'src/app/data/edit-song.service';
import {faLongArrowAltLeft} from '@fortawesome/free-solid-svg-icons';
import {State} from 'src/app/data/state';

@Component({
    selector: 'app-song-edit',
    templateUrl: './song-edit.component.html',
    styleUrls: ['./song-edit.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SongEditComponent implements OnInit {
    public form: FormGroup = null;
    public faArrow = faLongArrowAltLeft;


    constructor(
        private editSongService: EditSongService,
        private songsService: SongsService,
        private change: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.form = this.editSongService.initSongEditForm(true);
        this.change.markForCheck();
    }

    public onBack(): void {
        this.songsService.state.next(State.read);
    }
}
