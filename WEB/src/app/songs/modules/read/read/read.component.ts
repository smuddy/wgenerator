import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {faEdit, faLongArrowAltLeft} from '@fortawesome/free-solid-svg-icons';
import {Song} from 'src/app/songs/models/song.model';

@Component({
    selector: 'app-song-read',
    templateUrl: './read.component.html',
    styleUrls: ['./read.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SongReadComponent {
    @Input() public song: Song;
    public faArrow = faLongArrowAltLeft;
    public faEdit = faEdit;

    public get text(): string[] {
        return this.song && this.song.Text ? this.song.Text.split(/\r?\n/) : [];
    }

    public get comments(): string[] {
        return this.song && this.song.Comments ? this.song.Comments.split(/\r?\n/) : [];
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
