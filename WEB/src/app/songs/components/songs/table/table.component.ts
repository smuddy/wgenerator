import {SongsService} from '../../../../data/songs.service';
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {State} from 'src/app/data/state';
import {faFileMedical} from '@fortawesome/free-solid-svg-icons';
import {Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {MatPaginator} from '@angular/material';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements AfterViewInit {
    public State = State;
    public faNew = faFileMedical;
    public columnsFull = ['Number', 'Name', 'Key', 'SongType', 'Tempo'];
    public columnsPinned = ['Number', 'Name'];

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

    constructor(
        public songsService: SongsService,
        private ref: ChangeDetectorRef
    ) {
    }

    public ngAfterViewInit(): void {
        this.paginator.page.pipe(
            switchMap(_ => this.songsService.loadSongList$(_.pageIndex, _.pageSize))
        ).subscribe(() => {
            this.ref.markForCheck();
        });
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
