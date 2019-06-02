import {SongsService} from '../../../data/songs.service';
import {FileType} from '../../../models/files-types.model.ts';
import {FormGroup} from '@angular/forms';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {EditSongService} from 'src/app/data/edit-song.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-song-file-edit',
    templateUrl: './song-file-edit.component.html',
    styleUrls: ['./song-file-edit.component.less']
})
export class SongFileEditComponent implements OnInit, OnDestroy {
    @Input() fileId: number;
    @Output() back = new EventEmitter();
    public form: FormGroup;
    public subscription: Subscription;
    public fileTypes = [
        {value: FileType.None, text: null},
        {value: FileType.Sheet, text: 'Text'},
        {value: FileType.Chords, text: 'Text + Akkorde'},
        {value: FileType.MuseScore, text: 'MuseScore'}
    ];

    constructor(
        private editSongService: EditSongService,
        private songService: SongsService
    ) {
    }

    public ngOnInit(): void {
        const form = this.editSongService.initFileEditForm(
            this.songService.selectedSong.value.ID,
            this.fileId
        );
        this.form = form.form;
        this.subscription = form.changeSubscription;
    }

    public ngOnDestroy(): void {
        this.form = null;
        this.subscription.unsubscribe();
    }
}
