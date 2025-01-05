import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {ShowService} from '../services/show.service';
import {Observable, Subscription} from 'rxjs';
import {Show} from '../services/show';
import {SongService} from '../../songs/services/song.service';
import {Song} from '../../songs/services/song';
import {ShowSongService} from '../services/show-song.service';
import {ShowSong} from '../services/show-song';
import {DocxService} from '../services/docx.service';
import {
  faArrowUpRightFromSquare,
  faBox,
  faBoxOpen,
  faChevronRight,
  faFile,
  faFileDownload,
  faFileLines,
  faLock,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
  faSliders,
  faUnlock,
  faUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import {fade} from '../../../animations';
import {MatDialog} from '@angular/material/dialog';
import {ArchiveDialogComponent} from '../dialog/archive-dialog/archive-dialog.component';
import {closeFullscreen, openFullscreen} from '../../../services/fullscreen';
import {GuestShowService} from '../../guest/guest-show.service';
import {ShareDialogComponent} from '../dialog/share-dialog/share-dialog.component';
import { NgIf, NgFor, AsyncPipe, DatePipe } from '@angular/common';
import { CardComponent } from '../../../widget-modules/components/card/card.component';
import { UserNameComponent } from '../../../services/user/user-name/user-name.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MenuButtonComponent } from '../../../widget-modules/components/menu-button/menu-button.component';
import { MatTooltip } from '@angular/material/tooltip';
import { SongComponent } from './song/song.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AddSongComponent } from '../../../widget-modules/components/add-song/add-song.component';
import { ButtonRowComponent } from '../../../widget-modules/components/button-row/button-row.component';
import { RoleDirective } from '../../../services/user/role.directive';
import { OwnerDirective } from '../../../services/user/owner.directive';
import { ButtonComponent } from '../../../widget-modules/components/button/button.component';
import { MatMenuTrigger, MatMenu } from '@angular/material/menu';
import { ShowTypePipe } from '../../../widget-modules/pipes/show-type-translater/show-type.pipe';

@Component({
    selector: 'app-show',
    templateUrl: './show.component.html',
    styleUrls: ['./show.component.less'],
    animations: [fade],
    imports: [
        NgIf,
        CardComponent,
        UserNameComponent,
        MatCheckbox,
        ReactiveFormsModule,
        FormsModule,
        MenuButtonComponent,
        MatTooltip,
        CdkDropList,
        NgFor,
        CdkDrag,
        SongComponent,
        FaIconComponent,
        AddSongComponent,
        ButtonRowComponent,
        RoleDirective,
        OwnerDirective,
        ButtonComponent,
        MatMenuTrigger,
        MatMenu,
        AsyncPipe,
        DatePipe,
        ShowTypePipe,
    ],
})
export class ShowComponent implements OnInit, OnDestroy {
  public show$: Observable<Show | null> | null = null;
  public songs: Song[] | null = null;
  public showSongs: ShowSong[] | null = null;
  public showId: string | null = null;
  public showText = false;

  public faBox = faBox;
  public faBoxOpen = faBoxOpen;
  public faPublish = faUnlock;
  public faUnpublish = faLock;
  public faShare = faArrowUpRightFromSquare;
  public faDownload = faFileDownload;
  public faSliders = faSliders;
  public faUser = faUser;
  public faUsers = faUsers;
  public faZoomIn = faMagnifyingGlassPlus;
  public faZoomOut = faMagnifyingGlassMinus;
  public useSwiper = false;
  public textSize = 1;
  public faFileLines = faFileLines;
  public faFile = faFile;
  public faNextSong = faChevronRight;
  private subs: Subscription[] = [];

  public constructor(
    private activatedRoute: ActivatedRoute,
    private showService: ShowService,
    private songService: SongService,
    private showSongService: ShowSongService,
    private docxService: DocxService,
    private router: Router,
    private cRef: ChangeDetectorRef,
    public dialog: MatDialog,
    private guestShowService: GuestShowService,
  ) {
  }

  public ngOnInit(): void {
    this.show$ = this.activatedRoute.params.pipe(
      map(param => param as {showId: string}),
      map(param => param.showId),
      tap((_: string) => (this.showId = _)),
      switchMap((showId: string) => this.showService.read$(showId)),
    );
    this.subs.push(
      this.activatedRoute.params
        .pipe(
          map(param => param as {showId: string}),
          map(param => param.showId),
          switchMap(showId => this.showSongService.list$(showId)),
          filter(_ => !!_ && _.length > 0),
        )
        .subscribe(_ => {
          this.showSongs = _;
          this.cRef.markForCheck();
        }),
      this.songService
        .list$()
        .pipe(filter(_ => !!_))
        .subscribe(_ => {
          this.songs = _;
          this.cRef.markForCheck();
        }),
    );
  }

  public ngOnDestroy(): void {
    this.subs.forEach(_ => _.unsubscribe());
  }

  public onZoomIn() {
    this.textSize += 0.1;
  }

  public onZoomOut() {
    this.textSize -= 0.1;
  }

  public onArchive(archived: boolean): void {
    if (!archived && this.showId != null) void this.showService.update$(this.showId, {archived});
    else {
      const dialogRef = this.dialog.open(ArchiveDialogComponent, {
        width: '350px',
      });

      dialogRef.afterClosed().subscribe((archive: boolean) => {
        if (archive && this.showId != null) void this.showService.update$(this.showId, {archived});
      });
    }
  }

  public async onPublish(published: boolean): Promise<void> {
    if (this.showId != null) await this.showService.update$(this.showId, {published});
  }

  public onShare = async (show: Show): Promise<void> => {
    const url = await this.guestShowService.share(show, this.orderedShowSongs(show));
    this.dialog.open(ShareDialogComponent, {data: {url, show}});
  };

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

  public trackBy = (_: number, show: ShowSong) => show?.id;

  public async onChange(showId: string) {
    await this.router.navigateByUrl('/shows/' + showId + '/edit');
  }

  @HostListener('document:keydown', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent) {
    const swiperEl = document.querySelector('swiper-container') as unknown as Swiper;
    switch (event.code) {
      case 'ArrowRight':
      case 'ArrowDown':
        swiperEl.swiper.slideNext();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        swiperEl.swiper.slidePrev();
        break;
    }
  }

  public fullscreen(useSwiper: boolean) {
    if (useSwiper) openFullscreen();
    else closeFullscreen();
  }

  public getNextSong(showSongs: ShowSong[], i: number): string {
    if (!showSongs || showSongs.length === 0) return '';
    const song = showSongs[i + 1];
    return song?.title ?? '';
  }
}

export interface Swiper {
  swiper: {
    slideNext(): void;
    slidePrev(): void;
  };
}
