import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {ShowDataService} from './show-data.service';
import {ShowSongDataService} from './show-song-data.service';
import {ShowSongIndexService} from './show-song-index.service';
import {UserSessionService} from '../../../services/user/user-session.service';
import {User} from '../../../services/user/user';

describe('ShowSongIndexService', () => {
  let service: ShowSongIndexService;
  let showDataServiceSpy: jasmine.SpyObj<ShowDataService>;
  let showSongDataServiceSpy: jasmine.SpyObj<ShowSongDataService>;
  let sessionSpy: jasmine.SpyObj<UserSessionService>;

  beforeEach(async () => {
    showDataServiceSpy = jasmine.createSpyObj<ShowDataService>('ShowDataService', ['listRaw$', 'update']);
    showSongDataServiceSpy = jasmine.createSpyObj<ShowSongDataService>('ShowSongDataService', ['list$']);
    sessionSpy = jasmine.createSpyObj<UserSessionService>('UserSessionService', ['update$'], {
      user$: of({id: 'admin-1', name: 'Admin', role: 'admin', chordMode: 'onlyFirst', songUsage: {}} as User),
    });

    showDataServiceSpy.listRaw$.and.returnValue(of([{id: 'show-1'}, {id: 'show-2'}] as never) as unknown as ReturnType<ShowDataService['listRaw$']>);
    showDataServiceSpy.update.and.resolveTo();
    showSongDataServiceSpy.list$.and.callFake((showId: string) => {
      if (showId === 'show-1') {
        return of([{songId: 'song-1'}, {songId: 'song-2'}, {songId: 'song-1'}] as never) as never;
      }

      return of([{songId: 'song-3'}] as never) as never;
    });

    await TestBed.configureTestingModule({
      providers: [
        {provide: ShowDataService, useValue: showDataServiceSpy},
        {provide: ShowSongDataService, useValue: showSongDataServiceSpy},
        {provide: UserSessionService, useValue: sessionSpy},
      ],
    });

    service = TestBed.inject(ShowSongIndexService);
  });

  it('should rebuild the distinct songIds index for all shows', async () => {
    await expectAsync(service.rebuildShowSongIds()).toBeResolvedTo({
      showsProcessed: 2,
      showSongsProcessed: 4,
    });

    expect(showDataServiceSpy.update).toHaveBeenCalledWith('show-1', {songIds: ['song-1', 'song-2']});
    expect(showDataServiceSpy.update).toHaveBeenCalledWith('show-2', {songIds: ['song-3']});
  });

  it('should reject index rebuilds for non-admin users', async () => {
    Object.defineProperty(sessionSpy, 'user$', {
      value: of({id: 'user-1', name: 'User', role: 'leader', chordMode: 'onlyFirst', songUsage: {}} as User),
    });

    await expectAsync(service.rebuildShowSongIds()).toBeRejectedWithError('Admin role required to rebuild show song ids.');
  });
});
