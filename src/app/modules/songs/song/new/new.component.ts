import {Component, OnInit, inject} from '@angular/core';
import {faSave} from '@fortawesome/free-solid-svg-icons';
import {DestroyRef} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {SongService} from '../../services/song.service';
import {Song} from '../../services/song';
import {Router} from '@angular/router';
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
export class NewComponent implements OnInit {
  private songService = inject(SongService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  public faSave = faSave;
  public form = new FormGroup({
    number: new FormControl<number | null>(null, Validators.required),
    title: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
  });

  public ngOnInit(): void {
    this.form.reset();

    this.songService
      .list$()
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(songs => {
        const freeSongnumber = this.getFreeSongNumber(songs);
        this.form.controls.number.setValue(freeSongnumber);
      });
  }

  public async onSave(): Promise<void> {
    const {number: songNumber, title} = this.form.getRawValue();
    if (songNumber == null) {
      return;
    }
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
