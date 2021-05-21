import {Component, OnInit} from '@angular/core';
import {faSave} from '@fortawesome/free-solid-svg-icons/faSave';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {autoComplete, Unsubscriber} from 'ngx-hocs-unsubscriber';
import {SongService} from '../../services/song.service';
import {Song} from '../../services/song';
import {Router} from '@angular/router';

@Unsubscriber()
@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.less'],
})
export class NewComponent implements OnInit {
  public faSave = faSave;
  public form: FormGroup;

  public constructor(private songService: SongService, private router: Router) {}

  public ngOnInit(): void {
    this.form = new FormGroup({
      number: new FormControl(null, Validators.required),
      title: new FormControl(null, Validators.required),
    });

    this.songService
      .list$()
      .pipe(autoComplete(this))
      .subscribe(songs => {
        const freeSongnumber = this.getFreeSongNumber(songs);
        this.form.controls.number.setValue(freeSongnumber);
      });
  }

  public async onSave(): Promise<void> {
    const value = this.form.value as {number: number; title: string};
    const songNumber = value.number;
    const title = value.title;
    const newSongId = await this.songService.new(songNumber, title);
    await this.router.navigateByUrl('/songs/' + newSongId + '/edit');
  }

  private getFreeSongNumber(songs: Song[]): number {
    const songNumber = songs.map(_ => _.number);
    for (let i = 1; i < Number.MAX_SAFE_INTEGER; i++) {
      if (!songNumber.some(_ => _ === i)) {
        return i;
      }
    }
  }
}
