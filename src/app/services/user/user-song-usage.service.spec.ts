import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {DbService} from '../db.service';
import {ShowDataService} from '../../modules/shows/services/show-data.service';
import {ShowSongDataService} from '../../modules/shows/services/show-song-data.service';
import {UserSessionService} from './user-session.service';
import {UserSongUsageService} from './user-song-usage.service';

describe('UserSongUsageService', () => {
  let service: UserSongUsageService;
  let dbServiceSpy: jasmine.SpyObj<DbService>;
  let sessionSpy: jasmine.SpyObj<UserSessionService>;
  let showDataServiceSpy: jasmine.SpyObj<ShowDataService>;
  let showSongDataServiceSpy: jasmine.SpyObj<ShowSongDataService>;

  beforeEach(async () => {
    dbServiceSpy = jasmine.createSpyObj<DbService>('DbService', ['doc']);
    sessionSpy = jasmine.createSpyObj<UserSessionService>('UserSessionService', ['update$'], {
      user$: of({id: 'user-1', role: 'admin', songUsage: {}}) as never,
      users$: of([{id: 'user-1'}, {id: 'user-2'}]) as never,
    });
    showDataServiceSpy = jasmine.createSpyObj<ShowDataService>('ShowDataService', ['listRaw$']);
    showSongDataServiceSpy = jasmine.createSpyObj<ShowSongDataService>('ShowSongDataService', ['list$']);

    sessionSpy.update$.and.resolveTo();
    showDataServiceSpy.listRaw$.and.returnValue(
      of([
        {id: 'show-1', owner: 'user-1', archived: false},
        {id: 'show-2', owner: 'user-2', archived: true},
      ] as never)
    );
    showSongDataServiceSpy.list$.and.callFake((showId: string) =>
      of(showId === 'show-1' ? ([{songId: 'song-1'}, {songId: 'song-1'}, {songId: 'song-2'}] as never) : ([{songId: 'song-3'}] as never))
    );
    dbServiceSpy.doc.and.returnValue({update: jasmine.createSpy('update').and.resolveTo()} as never);

    await TestBed.configureTestingModule({
      providers: [
        {provide: DbService, useValue: dbServiceSpy},
        {provide: UserSessionService, useValue: sessionSpy},
        {provide: ShowDataService, useValue: showDataServiceSpy},
        {provide: ShowSongDataService, useValue: showSongDataServiceSpy},
      ],
    });

    service = TestBed.inject(UserSongUsageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should increment and decrement song usage for the current user', async () => {
    const updateSpy = jasmine.createSpy('update').and.resolveTo();
    dbServiceSpy.doc.and.returnValue({update: updateSpy} as never);

    await service.incSongCount('song-1');
    await service.decSongCount('song-2');

    expect(dbServiceSpy.doc).toHaveBeenCalledWith('users/user-1');
    expect(updateSpy.calls.argsFor(0)[0]).toEqual({'songUsage.song-1': jasmine.anything()});
    expect(updateSpy.calls.argsFor(1)[0]).toEqual({'songUsage.song-2': jasmine.anything()});
  });

  it('should rebuild song usage for all users based on owned show songs', async () => {
    await expectAsync(service.rebuildSongUsage()).toBeResolvedTo({
      usersProcessed: 2,
      showsProcessed: 2,
      showSongsProcessed: 3,
    });

    expect(sessionSpy.update$).toHaveBeenCalledWith('user-1', {songUsage: {'song-1': 2, 'song-2': 1}});
    expect(sessionSpy.update$).toHaveBeenCalledWith('user-2', {songUsage: {}});
  });

  it('should reject song usage rebuilds for non-admin users', async () => {
    Object.defineProperty(sessionSpy, 'user$', {value: of({id: 'user-1', role: 'leader'})});

    await expectAsync(service.rebuildSongUsage()).toBeRejectedWithError('Admin role required to rebuild songUsage.');
  });
});
