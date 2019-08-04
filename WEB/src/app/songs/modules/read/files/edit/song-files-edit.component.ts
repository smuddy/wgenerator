import {FormGroup} from '@angular/forms';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {EditSongService} from 'src/app/data/edit-song.service';
import {Subscription} from 'rxjs';
import {FileType} from '../../../../models/files-types.model';
import {File} from '../../../../models/file.model';

@Component({
    selector: 'app-song-file-edit',
    templateUrl: './song-files-edit.component.html',
    styleUrls: ['./song-files-edit.component.less']
})
export class SongFilesEditComponent implements OnInit, OnDestroy {
    @Input() file: File;
    @Input() songId: number;
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
        private editSongService: EditSongService) {
    }

    public ngOnInit(): void {
        const form = this.editSongService.initFileEditForm(
            this.songId,
            this.file,
        );
        this.form = form.form;
        this.subscription = form.changeSubscription;
    }

    public ngOnDestroy(): void {
        this.form = null;
        this.subscription.unsubscribe();
    }
}
