import {Component, OnInit} from '@angular/core';
import {Song} from '../../../services/song';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {SongService} from '../../../services/song.service';
import {EditService} from '../edit.service';
import {first, map, switchMap} from 'rxjs/operators';
import {KEYS} from '../../../services/key.helper';

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
  public legalOwner = SongService.LEGAL_OWNER;
  public legalType = SongService.LEGAL_TYPE;

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
      switchMap(songId => this.songService.read(songId)),
      first()
    ).subscribe(song => {
      this.song = song;
      this.form = this.editService.createSongForm(song);
    });
  }

  public async onSave(): Promise<void> {
    const data = this.form.value;
    await this.songService.update$(this.song.id, data);
    await this.router.navigateByUrl('songs/' + this.song.id);
  }

}
