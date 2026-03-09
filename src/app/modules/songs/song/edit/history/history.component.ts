import {Component, OnInit, inject} from '@angular/core';
import {first, map, switchMap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {SongService} from '../../../services/song.service';
import {Song} from '../../../services/song';
import {DatePipe} from '@angular/common';
import {CardComponent} from '../../../../../widget-modules/components/card/card.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.less'],
  imports: [CardComponent, DatePipe],
})
export class HistoryComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private songService = inject(SongService);

  public song: Song | null = null;

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
      });
  }
}
