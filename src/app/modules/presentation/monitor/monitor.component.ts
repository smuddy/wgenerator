import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map, switchMap, tap} from 'rxjs/operators';
import {ShowService} from '../../shows/services/show.service';
import {SongService} from '../../songs/services/song.service';
import {Section, TextRenderingService} from '../../songs/services/text-rendering.service';
import {Song} from '../../songs/services/song';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.less']
})
export class MonitorComponent implements OnInit {
  public song: Song;
  private index: number;
  private zoom: number;
  private sections: Section[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private showService: ShowService,
    private songService: SongService,
    private textRenderingService: TextRenderingService,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      map(_ => _.showId),
      switchMap(_ => this.showService.read$(_)),
      tap(_ => this.index = _.presentationSection),
      tap(_ => this.zoom = _.presentationZoom ?? 30),
      switchMap(_ => this.songService.read(_.presentationSongId))
    ).subscribe(_ => {
      this.song = _;
      this.sections = this.textRenderingService.parse(_.text);
    });
  }

}
