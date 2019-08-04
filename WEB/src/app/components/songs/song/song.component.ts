import {SongsService} from 'src/app/data/songs.service';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {faEdit, faLongArrowAltLeft} from '@fortawesome/free-solid-svg-icons';
import {Song} from 'src/app/models/song.model';
import {State} from 'src/app/data/state';

@Component({
    selector: 'app-song',
    templateUrl: './song.component.html',
    styleUrls: ['./song.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SongComponent {
    public song: Song;
    public faArrow = faLongArrowAltLeft;
    public faEdit = faEdit;
    public selectedSongId = 0;

    constructor(
        private songService: SongsService,
        change: ChangeDetectorRef
    ) {
        songService.selectedSong.subscribe(_ => {
            if (_) {
                this.selectedSongId = _.ID;
                this.song = _;
            } else {
                this.selectedSongId = 0;
                this.song = null;
            }
            change.markForCheck();
        });
    }

    public get text(): string[] {
        return this.song && this.song.Text ? this.song.Text.split(/\r?\n/) : [];
    }

    public get comments(): string[] {
        return this.song && this.song.Comments ? this.song.Comments.split(/\r?\n/) : [];
    }

    public onBack(): void {
        this.songService.resetSelectedSong();
    }

    public onClickEdit(): void {
        this.songService.state.next(State.edit);
    }

    public renderSongType(songType: string) {
        switch (songType) {
            case 'Praise':
                return {name: 'Lobpreis', color: '#99FFB8'};
            case 'Worship':
                return {name: 'Anbetung', color: '#C999FF'};
            default:
                return null;
        }
    }
}
