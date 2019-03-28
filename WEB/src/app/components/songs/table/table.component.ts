import { SongsService } from './../../../data/songs.service';
import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { State } from 'src/app/data/state';
import { faFileMedical } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {
  public selectedSongId = 0;
  public State = State;
  public faNew = faFileMedical;
  public columnsFull = ['Number', 'Name', 'Key', 'SongType', 'Tempo'];
  public columnsPinned = ['Number', 'Name'];
  public get columns(): string[] {
    return this.songsService.state === State.list ? this.columnsFull : this.columnsPinned;
  }

  constructor(
    public songsService: SongsService,
    private change: ChangeDetectorRef
  ) {
    songsService.selectedSong.subscribe(_ => {
        this.selectedSongId = _ ? _.ID : 0;
        this.change.markForCheck();
      }
    );
  }

  public renderSongType(songType: string) {
    switch (songType) {
      case 'Praise': return {name: 'Lobpreis', color: '#99FFB8'};
      case 'Worship': return {name: 'Anbetung', color: '#C999FF'};
      default: return null;
    }
  }

  public onClick(id: number): void {
    this.songsService.selectSong(id).subscribe();
    this.change.detectChanges();
  }

  public onClickNew(): void {
    this.songsService.selectSong(null).subscribe();
    this.songsService.state = State.new;
    this.change.detectChanges();
  }

}
