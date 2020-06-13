import {Component, OnInit} from '@angular/core';
import {first, map, switchMap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {SongService} from '../../../services/song.service';
import {Song} from '../../../services/song';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.less']
})
export class HistoryComponent implements OnInit {
  public song: Song;

  constructor(
    private activatedRoute: ActivatedRoute,
    private songService: SongService,
  ) {
  }


  public ngOnInit(): void {
    this.activatedRoute.params.pipe(
      map(param => param.songId),
      switchMap(songId => this.songService.read$(songId)),
      first()
    ).subscribe(song => {
      this.song = song;
    });
  }
}
