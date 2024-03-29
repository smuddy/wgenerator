import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SongService} from '../services/song.service';
import {map, switchMap} from 'rxjs/operators';
import {Song} from '../services/song';
import {Observable} from 'rxjs';
import {FileDataService} from '../services/file-data.service';
import {File} from '../services/file';
import {UserService} from '../../../services/user/user.service';
import {User} from '../../../services/user/user';
import {faEdit, faFileCirclePlus, faTrash} from '@fortawesome/free-solid-svg-icons';
import {ShowService} from '../../shows/services/show.service';
import {Show} from '../../shows/services/show';
import {ShowSongService} from '../../shows/services/show-song.service';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.less'],
})
export class SongComponent implements OnInit {
  public song$: Observable<Song | null> | null = null;
  public files$: Observable<File[] | null> | null = null;
  public user$: Observable<User | null> | null = null;
  public faEdit = faEdit;
  public faDelete = faTrash;
  public faFileCirclePlus = faFileCirclePlus;
  public privateShows$ = this.showService.list$().pipe(map(show => show.filter(_ => !_.published).sort((a, b) => b.date.toMillis() - a.date.toMillis())));

  public constructor(
    private activatedRoute: ActivatedRoute,
    private songService: SongService,
    private fileService: FileDataService,
    private userService: UserService,
    private router: Router,
    private showService: ShowService,
    private showSongService: ShowSongService
  ) {
    this.user$ = userService.user$;
  }

  public ngOnInit(): void {
    this.song$ = this.activatedRoute.params.pipe(
      map(param => param as {songId: string}),
      map(param => param.songId),
      switchMap(songId => this.songService.read$(songId))
    );

    this.files$ = this.activatedRoute.params.pipe(
      map(param => param as {songId: string}),
      map(param => param.songId),
      switchMap(songId => this.fileService.read$(songId))
    );
  }

  public getFlags = (flags: string): string[] => {
    if (!flags) {
      return [];
    }
    return flags.split(';').filter(_ => !!_);
  };

  public async onDelete(songId: string): Promise<void> {
    await this.songService.delete(songId);
    await this.router.navigateByUrl('/songs');
  }

  public async addSongToShow(show: Show, song: Song) {
    if (!show) return;
    const newId = await this.showSongService.new$(show?.id, song.id, false);
    await this.showService.update$(show?.id, {order: [...show.order, newId ?? '']});
    await this.router.navigateByUrl('/shows/' + show.id);
  }
}
