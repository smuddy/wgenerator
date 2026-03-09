import {Component, OnInit, inject} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {SongService} from '../services/song.service';
import {distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {Song} from '../services/song';
import {combineLatest, Observable} from 'rxjs';
import {FileDataService} from '../services/file-data.service';
import {File} from '../services/file';
import {UserService} from '../../../services/user/user.service';
import {User} from '../../../services/user/user';
import {faEdit, faFileCirclePlus, faTrash} from '@fortawesome/free-solid-svg-icons';
import {ShowService} from '../../shows/services/show.service';
import {Show} from '../../shows/services/show';
import {ShowSongService} from '../../shows/services/show-song.service';
import {AsyncPipe, DatePipe} from '@angular/common';
import {CardComponent} from '../../../widget-modules/components/card/card.component';
import {RoleDirective} from '../../../services/user/role.directive';
import {SongTextComponent} from '../../../widget-modules/components/song-text/song-text.component';
import {MatChipListbox, MatChipOption} from '@angular/material/chips';
import {ButtonRowComponent} from '../../../widget-modules/components/button-row/button-row.component';
import {ButtonComponent} from '../../../widget-modules/components/button/button.component';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {FileComponent} from './file/file.component';
import {SongTypePipe} from '../../../widget-modules/pipes/song-type-translater/song-type.pipe';
import {LegalOwnerPipe} from '../../../widget-modules/pipes/legal-owner-translator/legal-owner.pipe';
import {StatusPipe} from '../../../widget-modules/pipes/status-translater/status.pipe';
import {ShowTypePipe} from '../../../widget-modules/pipes/show-type-translater/show-type.pipe';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.less'],
  imports: [
    CardComponent,
    RoleDirective,
    SongTextComponent,
    MatChipListbox,
    MatChipOption,
    ButtonRowComponent,
    ButtonComponent,
    RouterLink,
    MatMenuTrigger,
    MatMenu,
    FileComponent,
    AsyncPipe,
    DatePipe,
    SongTypePipe,
    LegalOwnerPipe,
    StatusPipe,
    ShowTypePipe,
  ],
})
export class SongComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private songService = inject(SongService);
  private fileService = inject(FileDataService);
  private userService = inject(UserService);
  private router = inject(Router);
  private showService = inject(ShowService);
  private showSongService = inject(ShowSongService);

  public song$: Observable<Song | null> | null = null;
  public files$: Observable<File[] | null> | null = null;
  public user$: Observable<User | null> | null = null;
  public songCount$: Observable<number> | null = null;
  public faEdit = faEdit;
  public faDelete = faTrash;
  public faFileCirclePlus = faFileCirclePlus;
  public privateShows$ = this.showService.list$().pipe(map(show => show.filter(_ => !_.published).sort((a, b) => b.date.toMillis() - a.date.toMillis())));

  public constructor() {
    const userService = this.userService;

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

    this.songCount$ = combineLatest([this.user$, this.song$]).pipe(
      map(([user, song]) => {
        if (!song) {
          return 0;
        }

        return user?.songUsage?.[song.id] ?? 0;
      }),
      distinctUntilChanged()
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
