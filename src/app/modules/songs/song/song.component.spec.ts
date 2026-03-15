import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {SongComponent} from './song.component';
import {of} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {SongService} from '../services/song.service';
import {FileDataService} from '../services/file-data.service';
import {UserService} from '../../../services/user/user.service';
import {ShowService} from '../../shows/services/show.service';
import {ShowSongService} from '../../shows/services/show-song.service';

describe('SongComponent', () => {
  let component: SongComponent;
  let fixture: ComponentFixture<SongComponent>;

  const mockActivatedRoute = {
    params: of({songId: '4711'}),
  };

  beforeEach(waitForAsync(() => {
    const songServiceSpy = jasmine.createSpyObj<SongService>('SongService', ['read$']);
    const fileDataServiceSpy = jasmine.createSpyObj<FileDataService>('FileDataService', ['read$']);
    const userServiceSpy = jasmine.createSpyObj<UserService>('UserService', ['incSongCount', 'decSongCount'], {
      user$: of({id: 'user-1', name: 'Benjamin', role: 'leader', chordMode: 'onlyFirst', songUsage: {'4711': 2}}),
      userId$: of('user-1'),
    });
    const showServiceSpy = jasmine.createSpyObj<ShowService>('ShowService', ['list$', 'update$']);
    const showSongServiceSpy = jasmine.createSpyObj<ShowSongService>('ShowSongService', ['new$']);

    songServiceSpy.read$.and.returnValue(of({id: '4711', title: 'Test Song', number: '1', text: '', showType: '', flags: ''} as never));
    fileDataServiceSpy.read$.and.returnValue(of([]));
    showServiceSpy.list$.and.returnValue(of([]));
    userServiceSpy.loggedIn$ = jasmine.createSpy('loggedIn$').and.returnValue(of(true));
    userServiceSpy.getUserbyId$ = jasmine.createSpy('getUserbyId$').and.returnValue(of({name: 'Benjamin'}));

    void TestBed.configureTestingModule({
      imports: [SongComponent],
      providers: [
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: SongService, useValue: songServiceSpy},
        {provide: FileDataService, useValue: fileDataServiceSpy},
        {provide: UserService, useValue: userServiceSpy},
        {provide: ShowService, useValue: showServiceSpy},
        {provide: ShowSongService, useValue: showSongServiceSpy},
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
