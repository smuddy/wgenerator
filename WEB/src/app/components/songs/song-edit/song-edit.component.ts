import { SongsService } from 'src/app/data/songs.service';
import { FormGroup } from '@angular/forms';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { blend } from 'src/app/services/animation';
import { EditSongService } from 'src/app/data/edit-song.service';
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-song-edit',
  templateUrl: './song-edit.component.html',
  styleUrls: ['./song-edit.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [blend]
})
export class SongEditComponent implements OnInit {
  public form: FormGroup = null;
  public faArrow = faLongArrowAltLeft;
  public keys = [
    'C',
    'C#',
    'Db',
    'D',
    'D#',
    'Eb',
    'E',
    'F',
    'F#',
    'Gb',
    'G',
    'G#',
    'Ab',
    'A',
    'A#',
    'B',
    'H',
    'c',
    'c#',
    'db',
    'd',
    'd#',
    'eb',
    'e',
    'f',
    'f#',
    'gb',
    'g',
    'g#',
    'ab',
    'a',
    'A#',
    'b',
    'h'
  ];

  constructor(
    private editSongService: EditSongService,
    private songsService: SongsService,
    private change: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.form = this.editSongService.initEditForm();
    this.change.markForCheck();
  }

  public onBack(): void {
    this.songsService.edit = false;
  }
}
