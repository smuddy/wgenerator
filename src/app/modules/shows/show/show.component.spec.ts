import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BehaviorSubject, of} from 'rxjs';
import {ShowComponent} from './show.component';
import {ActivatedRoute, Router} from '@angular/router';
import {ShowService} from '../services/show.service';
import {SongService} from '../../songs/services/song.service';
import {ShowSongService} from '../services/show-song.service';
import {DocxService} from '../services/docx.service';
import {UserService} from '../../../services/user/user.service';
import {MatDialog} from '@angular/material/dialog';
import {GuestShowService} from '../../guest/guest-show.service';

describe('ShowComponent', () => {
  let component: ShowComponent;
  let fixture: ComponentFixture<ShowComponent>;
  let showServiceSpy: jasmine.SpyObj<ShowService>;
  let showSongServiceSpy: jasmine.SpyObj<ShowSongService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let user$: BehaviorSubject<unknown>;
  let userId$: BehaviorSubject<string | null>;

  beforeEach(async () => {
    showServiceSpy = jasmine.createSpyObj<ShowService>('ShowService', ['update$', 'read$']);
    showSongServiceSpy = jasmine.createSpyObj<ShowSongService>('ShowSongService', ['list$', 'list']);
    dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    user$ = new BehaviorSubject<unknown>({id: 'user-1', role: ['leader']});
    userId$ = new BehaviorSubject<string | null>('user-1');

    showServiceSpy.read$.and.returnValue(of(null));
    showServiceSpy.update$.and.resolveTo();
    showSongServiceSpy.list$.and.returnValue(of([]));
    showSongServiceSpy.list.and.resolveTo([]);

    await TestBed.configureTestingModule({
      imports: [ShowComponent],
      providers: [
        {provide: ActivatedRoute, useValue: {params: of({showId: 'show-1'})}},
        {provide: ShowService, useValue: showServiceSpy},
        {provide: SongService, useValue: {list$: () => of([])}},
        {provide: ShowSongService, useValue: showSongServiceSpy},
        {provide: DocxService, useValue: {create: jasmine.createSpy('create').and.resolveTo()}},
        {provide: Router, useValue: {navigateByUrl: jasmine.createSpy('navigateByUrl')}},
        {
          provide: UserService,
          useValue: {
            user$: user$.asObservable(),
            userId$: userId$.asObservable(),
            loggedIn$: () => of(true),
          },
        },
        {provide: MatDialog, useValue: dialogSpy},
        {provide: GuestShowService, useValue: {share: jasmine.createSpy('share').and.resolveTo('https://example.invalid')}},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });

  it('should reset reportedType when unpublishing', async () => {
    await component.onPublish({id: 'show-1', public: true} as never, false);

    expect(showServiceSpy.update$).toHaveBeenCalledWith('show-1', {published: false, reportedType: null});
  });

  it('should set not-required for private shows when publishing', async () => {
    await component.onPublish({id: 'show-1', public: false} as never, true);

    expect(showServiceSpy.update$).toHaveBeenCalledWith('show-1', {published: true, reportedType: 'not-required'});
  });

  it('should set pending for public shows with reportable CCLI songs', async () => {
    showSongServiceSpy.list.and.resolveTo([{legalOwner: 'CCLI', legalOwnerId: '123'}] as never);

    await component.onPublish({id: 'show-1', public: true} as never, true);

    expect(showServiceSpy.update$).toHaveBeenCalledWith('show-1', {published: true, reportedType: 'pending'});
  });

  it('should set not-required for public shows without reportable CCLI songs', async () => {
    showSongServiceSpy.list.and.resolveTo([{legalOwner: 'CCLI', legalOwnerId: ''}] as never);

    await component.onPublish({id: 'show-1', public: true} as never, true);

    expect(showServiceSpy.update$).toHaveBeenCalledWith('show-1', {published: true, reportedType: 'not-required'});
  });

  it('should open report dialog with deduplicated reportable songs and mark show as reported', () => {
    component.showSongs = [
      {id: 'show-song-1', songId: 'song-1', title: 'Alpha', legalOwner: 'CCLI', legalOwnerId: '123'},
      {id: 'show-song-2', songId: 'song-1', title: 'Alpha', legalOwner: 'CCLI', legalOwnerId: '123'},
      {id: 'show-song-3', songId: 'song-2', title: 'Beta', legalOwner: 'other', legalOwnerId: '456'},
      {id: 'show-song-4', songId: 'song-3', title: 'Gamma', legalOwner: 'CCLI', legalOwnerId: '789'},
    ] as never;
    dialogSpy.open.and.returnValue({afterClosed: () => of(true)} as never);

    component.onReport({id: 'show-1', order: ['show-song-1', 'show-song-2', 'show-song-3', 'show-song-4']} as never);

    expect(dialogSpy.open).toHaveBeenCalledWith(jasmine.any(Function), {
      width: '640px',
      data: {
        songs: [
          {title: 'Alpha', ccliNumber: '123'},
          {title: 'Gamma', ccliNumber: '789'},
        ],
      },
    });
    expect(showServiceSpy.update$).toHaveBeenCalledWith('show-1', {reportedType: 'reported'});
  });
});
