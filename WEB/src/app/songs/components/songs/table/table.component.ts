import {SongsService} from '../../../../data/songs.service';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {State} from 'src/app/data/state';
import {faFileMedical} from '@fortawesome/free-solid-svg-icons';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {
    public State = State;
    public faNew = faFileMedical;
    public columnsFull = ['Number', 'Name', 'Key', 'SongType', 'Tempo'];
    public columnsPinned = ['Number', 'Name'];

    constructor(
        public songsService: SongsService,
        private change: ChangeDetectorRef
    ) {
    }

    public get columns(): Observable<string[]> {
        return this.songsService.state.pipe(map(_ => _ === State.list ? this.columnsFull : this.columnsPinned));
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
