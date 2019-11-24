import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SongService} from '../services/song.service';
import {map, switchMap} from 'rxjs/operators';
import {Song} from '../models/song';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.less']
})
export class SongComponent implements OnInit {
  public song$: Observable<Song>;

  constructor(private activatedRoute: ActivatedRoute, private songService: SongService) {
  }

  public ngOnInit(): void {
    this.song$ = this.activatedRoute.params.pipe(
      map(param => param.songId),
      switchMap(songId => this.songService.read(songId))
    );
  }

}
