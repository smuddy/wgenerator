import { EditSongService } from './../../../data/edit-song.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { faLongArrowAltLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { State } from 'src/app/data/state';
import { SongsService } from 'src/app/data/songs.service';

@Component({
  selector: 'app-song-new',
  templateUrl: './song-new.component.html',
  styleUrls: ['./song-new.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SongNewComponent implements OnInit {
  public faArrow = faLongArrowAltLeft;
  public faSave = faSave;
  public form: FormGroup;

  constructor(
    private editSongService: EditSongService,
    private songsService: SongsService,
    private change: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.form = this.editSongService.initEditForm(false);
    this.change.markForCheck();
  }

  public onBack(): void {
    this.songsService.state = State.list;
    this.songsService.resetSelectedSong();
  }

  public onClickAdd(): void {
    this.songsService.saveNewSong$(this.form.value).subscribe();
  }

}
