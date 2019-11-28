import {Component, OnInit} from '@angular/core';
import {Song} from '../../models/song';
import {ActivatedRoute, Router} from '@angular/router';
import {SongService} from '../../services/song.service';
import {first, map, switchMap} from 'rxjs/operators';
import {FormGroup} from '@angular/forms';
import {EditService} from './edit.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {
  public song: Song;
  public form: FormGroup;
  public keys = this.songService.KEYS;
  public types = this.songService.TYPES;

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
    await this.songService.update(this.song.id, data);
    await this.router.navigateByUrl('songs/' + this.song.id);
  }
}
