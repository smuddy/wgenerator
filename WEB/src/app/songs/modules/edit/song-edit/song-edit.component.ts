import {FormGroup} from '@angular/forms';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {EditSongService} from 'src/app/data/edit-song.service';
import {faLongArrowAltLeft} from '@fortawesome/free-solid-svg-icons';
import {ActivatedRoute} from '@angular/router';
import {Song} from '../../../models/song.model';

@Component({
    selector: 'app-song-edit',
    templateUrl: './song-edit.component.html',
    styleUrls: ['./song-edit.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SongEditComponent implements OnInit {
    public form: FormGroup = null;
    public faArrow = faLongArrowAltLeft;
    public songId: number;

    constructor(
        private editSongService: EditSongService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe((data: { song: Song }) => {
            this.songId = data.song.ID;
            this.form = this.editSongService.initSongEditForm(true, data.song);
        });
    }
}
