import {Component, OnInit} from '@angular/core';
import {Song} from '../../../services/song';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {SongService} from '../../../services/song.service';
import {EditService} from '../edit.service';
import {first, map, switchMap} from 'rxjs/operators';
import {KEYS} from '../../../services/key.helper';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import {faSave} from '@fortawesome/free-solid-svg-icons/faSave';
import {faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';

@Component({
  selector: 'app-edit-song',
  templateUrl: './edit-song.component.html',
  styleUrls: ['./edit-song.component.less']
})
export class EditSongComponent implements OnInit {
  public song: Song;
  public form: FormGroup;
  public keys = KEYS;
  public types = SongService.TYPES;
  public status = SongService.STATUS;
  public legalOwner = SongService.LEGAL_OWNER;
  public legalType = SongService.LEGAL_TYPE;
  public flags: string[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public faRemove = faTimesCircle;
  public faSave = faSave;
  public faLink = faExternalLinkAlt;

  constructor(
    private activatedRoute: ActivatedRoute,
    private songService: SongService,
    private editService: EditService,
    private router: Router
  ) {
  }

  public ngOnInit(): void {
    this.activatedRoute.params.pipe(
      map(param => param.songId),
      switchMap(songId => this.songService.read$(songId)),
      first()
    ).subscribe(song => {
      this.song = song;
      this.form = this.editService.createSongForm(song);
      this.form.controls.flags.valueChanges.subscribe(_ => this.onFlagsChanged(_))
      this.onFlagsChanged(this.form.controls.flags.value);
    });
  }

  public async onSave(): Promise<void> {
    const data = this.form.value;
    await this.songService.update$(this.song.id, data);
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

    if (input) input.value = '';
  }

  private onFlagsChanged(flagArray: string): void {
    if (!flagArray) {
      this.flags = [];
      return;
    }

    this.flags = flagArray.split(';').filter(_ => !!_);
  }
}
