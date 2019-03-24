import { SongsService } from './../../../data/songs.service';
import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {
  public selectedSongId = 0;
  public columnsFull = ['Number', 'Name', 'Key', 'SongType', 'Tempo'];
  public columnsPinned = ['Number', 'Name'];
  public get columns(): string[] {
    return this.selectedSongId === 0 ? this.columnsFull : this.columnsPinned;
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
    this.songsService.selectSong(id);
    this.change.detectChanges();
  }
}
