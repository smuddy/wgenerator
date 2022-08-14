import {Component, OnInit} from '@angular/core';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {ShowService} from '../services/show.service';
import {Observable} from 'rxjs';
import {Show} from '../services/show';
import {SongService} from '../../songs/services/song.service';
import {Song} from '../../songs/services/song';
import {ShowSongService} from '../services/show-song.service';
import {ShowSong} from '../services/show-song';
import {DocxService} from '../services/docx.service';
import {faBox, faBoxOpen, faExternalLinkAlt, faFileDownload, faLock, faUser, faUsers} from '@fortawesome/free-solid-svg-icons';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.less'],
})
export class ShowComponent implements OnInit {
  public show$: Observable<Show | null> | null = null;
  public songs: Song[] | null = null;
  public showSongs: ShowSong[] | null = null;
  public showId: string | null = null;
  public showText = false;

  public faBox = faBox;
  public faBoxOpen = faBoxOpen;
  public faPublish = faExternalLinkAlt;
  public faUnpublish = faLock;
  public faDownload = faFileDownload;
  public faUser = faUser;
  public faUsers = faUsers;

  public constructor(
    private activatedRoute: ActivatedRoute,
    private showService: ShowService,
    private songService: SongService,
    private showSongService: ShowSongService,
    private docxService: DocxService
  ) {}

  public ngOnInit(): void {
    this.show$ = this.activatedRoute.params.pipe(
      map(param => param as {showId: string}),
      map(param => param.showId),
      tap((_: string) => (this.showId = _)),
      switchMap((showId: string) => this.showService.read$(showId))
    );
    this.activatedRoute.params
      .pipe(
        map(param => param as {showId: string}),
        map(param => param.showId),
        switchMap(showId => this.showSongService.list$(showId)),
        tap(_ => console.log(_)),
        filter(_ => !!_ && _.length > 0)
      )
      .subscribe(_ => (this.showSongs = _));
    this.songService
      .list$()
      .pipe(filter(_ => !!_))
      .subscribe(_ => (this.songs = _));
  }

  public getSong(songId: string): Song | null {
    if (!this.songs) return null;
    const filtered = this.songs.filter(_ => _.id === songId);
    return filtered.length > 0 ? filtered[0] : null;
  }

  public async onArchive(archived: boolean): Promise<void> {
    if (this.showId != null) await this.showService.update$(this.showId, {archived});
  }

  public async onPublish(published: boolean): Promise<void> {
    if (this.showId != null) await this.showService.update$(this.showId, {published});
  }

  public getStatus(show: Show): string {
    if (show.published) {
      return 'veröffentlicht';
    }
    if (show.reported) {
      return 'gemeldet';
    }
    return 'entwurf';
  }

  public async onDownload(): Promise<void> {
    if (this.showId != null) await this.docxService.create(this.showId);
  }

  public async onDownloadHandout(): Promise<void> {
    if (this.showId != null)
      await this.docxService.create(this.showId, {
        chordMode: 'hide',
        copyright: true,
      });
  }

  public async drop(event: CdkDragDrop<never>, show: Show): Promise<void> {
    const order = [...show.order];
    moveItemInArray(order, event.previousIndex, event.currentIndex);
    await this.showService.update$(show.id, {order});
  }

  public orderedShowSongs(show: Show): ShowSong[] {
    const list = this.showSongs;
    if (!list) return [];
    return show.order.map(_ => list.filter(f => f.id === _)[0]);
  }

  public trackBy = (index: number, show: ShowSong) => show.id;
}
