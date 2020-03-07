import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SongService} from '../services/song.service';
import {map, switchMap} from 'rxjs/operators';
import {Song} from '../services/song';
import {Observable} from 'rxjs';
import {FileDataService} from '../services/file-data.service';
import {File} from '../services/file';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.less']
})
export class SongComponent implements OnInit {
  public song$: Observable<Song>;
  public files$: Observable<File[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private songService: SongService,
    private fileService: FileDataService,
  ) {
  }

  public ngOnInit(): void {
    this.song$ = this.activatedRoute.params.pipe(
      map(param => param.songId),
      switchMap(songId => this.songService.read(songId))
    );

    this.files$ = this.activatedRoute.params.pipe(
      map(param => param.songId),
      switchMap(songId => this.fileService.read$(songId))
    );

  }

}
