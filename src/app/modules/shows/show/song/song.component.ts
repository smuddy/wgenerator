import {Component, Input, OnInit} from '@angular/core';
import {ShowSongService} from '../../services/show-song.service';
import {ShowSong} from '../../services/show-song';
import {getScale} from '../../../songs/services/key.helper';
import {UntypedFormControl} from '@angular/forms';
import {ChordMode} from '../../../../widget-modules/components/song-text/song-text.component';
import {Show} from '../../services/show';
import {faEraser, faPenToSquare, faSave, faTrash} from '@fortawesome/free-solid-svg-icons';
import {fade} from '../../../../animations';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.less'],
  animations: [fade],
})
export class SongComponent implements OnInit {
  @Input() public show: Show | null = null;
  @Input() public showId: string | null = null;
  @Input() public showText: boolean | null = null;
  @Input() public index = -1;

  public keys: string[] = [];
  public faDelete = faTrash;
  public faEdit = faPenToSquare;
  public faSave = faSave;
  public faEraser = faEraser;
  public keyFormControl: UntypedFormControl = new UntypedFormControl();
  public iSong: ShowSong | null = null;
  public edit = false;
  public editSongControl = new UntypedFormControl();

  public constructor(private showSongService: ShowSongService) {}

  @Input()
  public set showSong(song: ShowSong) {
    this.iSong = song;
    this.keys = song ? getScale(song.key) : [];
  }

  public ngOnInit(): void {
    if (!this.iSong) return;
    this.keyFormControl = new UntypedFormControl(this.iSong.key);
    this.keyFormControl.valueChanges.subscribe((value: string) => {
      if (!this.showId || !this.iSong) return;
      void this.showSongService.update$(this.showId, this.iSong.id, {key: value});
    });
  }

  public onEdit(): void {
    if (this.iSong) this.editSongControl.setValue(this.iSong.text);
    this.edit = true;
  }

  public onDiscard(): void {
    this.editSongControl.setValue(null);
    this.edit = false;
  }

  public onSave(): void {
    if (this.showId && this.iSong) void this.showSongService.update$(this.showId, this.iSong.id, {text: this.editSongControl.value as string});
    this.editSongControl.setValue(null);
    this.edit = false;
  }

  public async onDelete(): Promise<void> {
    if (!this.showId || !this.iSong || this.index === -1) return;
    await this.showSongService.delete$(this.showId, this.iSong.id, this.index);
  }

  public async onChordModeChanged(value: ChordMode): Promise<void> {
    if (!this.showId || !this.iSong) return;
    await this.showSongService.update$(this.showId, this.iSong.id, {
      chordMode: value,
    });
  }
}
