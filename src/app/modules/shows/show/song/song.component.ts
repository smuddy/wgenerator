import {Component, Input} from '@angular/core';
import {Song} from '../../../songs/services/song';
import {faTrash} from '@fortawesome/free-solid-svg-icons/faTrash';
import {faCaretUp} from '@fortawesome/free-solid-svg-icons/faCaretUp';
import {faCaretDown} from '@fortawesome/free-solid-svg-icons/faCaretDown';
import {ShowSongService} from '../../services/show-song.service';
import {ShowSong} from '../../services/showSong';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.less']
})
export class SongComponent {
  @Input() public song: Song;
  @Input() public showId: string;
  @Input() public showSongId: string;
  @Input() public showSongs: ShowSong[];
  public faDelete = faTrash;
  public faUp = faCaretUp;
  public faDown = faCaretDown;

  constructor(
    private showSongService: ShowSongService,
  ) {
  }

  public async onDelete(): Promise<void> {
    await this.showSongService.delete$(this.showId, this.showSongId);
  }


  public async reorder(up: boolean): Promise<void> {
    if (up) await this.reorderUp(); else await this.reorderDown();
  }

  public async reorderUp(): Promise<void> {
    const index = this.showSongs.findIndex(_ => _.songId === this.song.id);
    if (index === 0) return;

    const song = this.showSongs[index];
    const toggleSong = this.showSongs[index - 1];

    await this.showSongService.update$(this.showId, song.id, {order: toggleSong.order});
    await this.showSongService.update$(this.showId, toggleSong.id, {order: song.order});
  }

  public async reorderDown(): Promise<void> {
    const index = this.showSongs.findIndex(_ => _.songId === this.song.id);
    if (index === this.showSongs.length - 1) return;

    const song = this.showSongs[index];
    const toggleSong = this.showSongs[index + 1];

    await this.showSongService.update$(this.showId, song.id, {order: toggleSong.order});
    await this.showSongService.update$(this.showId, toggleSong.id, {order: song.order});
  }


}
