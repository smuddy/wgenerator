import {Component, OnInit} from '@angular/core';
import {Song} from '../../../services/song';
import {ReactiveFormsModule, UntypedFormGroup} from '@angular/forms';
import {ActivatedRoute, Router, RouterStateSnapshot} from '@angular/router';
import {SongService} from '../../../services/song.service';
import {EditService} from '../edit.service';
import {first, map, switchMap} from 'rxjs/operators';
import {KEYS} from '../../../services/key.helper';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipGrid, MatChipInput, MatChipInputEvent, MatChipRow} from '@angular/material/chips';
import {faExternalLinkAlt, faSave, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import {MatDialog} from '@angular/material/dialog';
import {SaveDialogComponent} from './save-dialog/save-dialog.component';
import {NgFor, NgIf} from '@angular/common';
import {CardComponent} from '../../../../../widget-modules/components/card/card.component';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {SongTextComponent} from '../../../../../widget-modules/components/song-text/song-text.component';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {MatTooltip} from '@angular/material/tooltip';
import {ButtonRowComponent} from '../../../../../widget-modules/components/button-row/button-row.component';
import {ButtonComponent} from '../../../../../widget-modules/components/button/button.component';
import {SongTypePipe} from '../../../../../widget-modules/pipes/song-type-translater/song-type.pipe';
import {LegalOwnerPipe} from '../../../../../widget-modules/pipes/legal-owner-translator/legal-owner.pipe';
import {LegalTypePipe} from '../../../../../widget-modules/pipes/legal-type-translator/legal-type.pipe';
import {KeyPipe} from '../../../../../widget-modules/pipes/key-translator/key.pipe';
import {StatusPipe} from '../../../../../widget-modules/pipes/status-translater/status.pipe';

@Component({
  selector: 'app-edit-song',
  templateUrl: './edit-song.component.html',
  styleUrls: ['./edit-song.component.less'],
  imports: [
    NgIf,
    CardComponent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    NgFor,
    MatOption,
    CdkTextareaAutosize,
    SongTextComponent,
    MatChipGrid,
    MatChipRow,
    FaIconComponent,
    MatChipInput,
    MatSuffix,
    MatTooltip,
    ButtonRowComponent,
    ButtonComponent,
    SongTypePipe,
    LegalOwnerPipe,
    LegalTypePipe,
    KeyPipe,
    StatusPipe,
  ],
})
export class EditSongComponent implements OnInit {
  public song: Song | null = null;
  public form: UntypedFormGroup = new UntypedFormGroup({});
  public keys = KEYS;
  public types = SongService.TYPES;
  public status = SongService.STATUS;
  public legalOwner = SongService.LEGAL_OWNER;
  public legalType = SongService.LEGAL_TYPE;
  public flags: string[] = [];
  public readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public faRemove = faTimesCircle;
  public faSave = faSave;
  public faLink = faExternalLinkAlt;
  public songtextFocus = false;

  public constructor(
    private activatedRoute: ActivatedRoute,
    private songService: SongService,
    private editService: EditService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        map(param => param as {songId: string}),
        map(param => param.songId),
        switchMap(songId => this.songService.read$(songId)),
        first()
      )
      .subscribe(song => {
        this.song = song;
        if (!song) return;
        this.form = this.editService.createSongForm(song);
        this.form.controls.flags.valueChanges.subscribe(_ => this.onFlagsChanged(_ as string));
        this.onFlagsChanged(this.form.controls.flags.value as string);
      });
  }

  public async onSave(): Promise<void> {
    if (!this.song) return;
    const data = this.form.value as Partial<Song>;
    await this.songService.update$(this.song.id, data);
    this.form.markAsPristine();
    await this.router.navigateByUrl('songs/' + this.song.id);
  }

  public removeFlag(flag: string): void {
    const flags = this.flags.filter(_ => _ !== flag);
    this.form.controls.flags.setValue(flags.join(';'));
  }

  public addFlag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      const flags = [...this.flags, value.trim()];
      this.form.controls.flags.setValue(flags.join(';'));
    }

    if (input) {
      input.value = '';
    }
  }

  public askForSave(nextState: RouterStateSnapshot): boolean {
    if (!this.form.dirty) {
      return true;
    }

    const dialogRef = this.dialog.open(SaveDialogComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe((save: boolean) => {
      void this.onSaveDialogAfterClosed(save, nextState.url).then();
    });

    return false;
  }

  private onFlagsChanged(flagArray: string): void {
    if (!flagArray) {
      this.flags = [];
      return;
    }

    this.flags = flagArray.split(';').filter(_ => !!_);
  }

  private async onSaveDialogAfterClosed(save: boolean, url: string) {
    if (save && this.song) {
      const data = this.form.value as Partial<Song>;
      await this.songService.update$(this.song.id, data);
    }

    this.form.markAsPristine();
    await this.router.navigateByUrl(url);
  }
}
