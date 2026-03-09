import {Component, OnDestroy, OnInit} from '@angular/core';
import {faSave} from '@fortawesome/free-solid-svg-icons';
import {ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {SongService} from '../../services/song.service';
import {Song} from '../../services/song';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {take} from 'rxjs/operators';
import {CardComponent} from '../../../../widget-modules/components/card/card.component';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {ButtonRowComponent} from '../../../../widget-modules/components/button-row/button-row.component';
import {ButtonComponent} from '../../../../widget-modules/components/button/button.component';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.less'],
  imports: [CardComponent, ReactiveFormsModule, MatFormField, MatLabel, MatInput, ButtonRowComponent, ButtonComponent],
})
export class NewComponent implements OnInit, OnDestroy {
  public faSave = faSave;
  public form: UntypedFormGroup = new UntypedFormGroup({
    number: new UntypedFormControl(null, Validators.required),
    title: new UntypedFormControl(null, Validators.required),
  });
  private subs: Subscription[] = [];

  public constructor(
    private songService: SongService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.form.reset();

    this.subs.push(
      this.songService
        .list$()
        .pipe(take(1))
        .subscribe(songs => {
          const freeSongnumber = this.getFreeSongNumber(songs);
          this.form.controls.number.setValue(freeSongnumber);
        })
    );
  }

  public ngOnDestroy(): void {
    this.subs.forEach(_ => _.unsubscribe());
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
    return Number.MAX_SAFE_INTEGER;
  }
}
