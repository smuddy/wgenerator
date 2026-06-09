import {ComponentFixture, TestBed} from '@angular/core/testing';

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

  beforeEach(async () => {
    const songServiceSpy = {
      read$: vi.fn().mockReturnValue(of({id: '4711', title: 'Test Song', number: '1', text: '', showType: '', flags: ''} as never)),
    };
    const fileDataServiceSpy = {
      read$: vi.fn().mockReturnValue(of([])),
    };
    const userServiceSpy = {
      incSongCount: vi.fn(),
      decSongCount: vi.fn(),
      user$: of({id: 'user-1', name: 'Benjamin', role: 'leader', chordMode: 'onlyFirst', songUsage: {'4711': 2}}),
      userId$: of('user-1'),
      loggedIn$: vi.fn().mockReturnValue(of(true)),
      getUserbyId$: vi.fn().mockReturnValue(of({name: 'Benjamin'})),
    };
    const showServiceSpy = {
      list$: vi.fn().mockReturnValue(of([])),
      update$: vi.fn(),
    };
    const showSongServiceSpy = {
      new$: vi.fn(),
    };

    await TestBed.configureTestingModule({
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });

  it('should hide add-to-show when there are no private shows', () => {
    const buttons = Array.from(fixture.nativeElement.querySelectorAll('app-button button')) as HTMLButtonElement[];
    const addButton = buttons.find(button => button.textContent?.includes('Zu Veranstaltung hinzufügen'));

    void expect(addButton).toBeUndefined();
  });
});
