import {TestBed} from '@angular/core/testing';
import {BehaviorSubject, of} from 'rxjs';
import {SongDataService} from '../../songs/services/song-data.service';
import {UserService} from '../../../services/user/user.service';
import {ShowService} from './show.service';
import {ShowSongDataService} from './show-song-data.service';
import {ShowSongService} from './show-song.service';
import {ShowSong} from './show-song';
import {Song} from '../../songs/services/song';
import {Show} from './show';
import {User} from '../../../services/user/user';

describe('ShowSongService', () => {
  let service: ShowSongService;
  let showSongDataServiceSpy: jasmine.SpyObj<ShowSongDataService>;
  let songDataServiceSpy: jasmine.SpyObj<SongDataService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let showServiceSpy: jasmine.SpyObj<ShowService>;
  let user$: BehaviorSubject<User | null>;
  const song = {id: 'song-1', key: 'G', title: 'Amazing Grace'} as unknown as Song;
  const showSong = {id: 'show-song-1', songId: 'song-1'} as unknown as ShowSong;
  const show = {id: 'show-1', order: ['show-song-1', 'show-song-2']} as unknown as Show;

  beforeEach(async () => {
    user$ = new BehaviorSubject<User | null>({id: 'user-1', name: 'Benjamin', role: 'editor', chordMode: 'letters', songUsage: {}});
    showSongDataServiceSpy = jasmine.createSpyObj<ShowSongDataService>('ShowSongDataService', ['add', 'read$', 'list$', 'delete', 'update$']);
    songDataServiceSpy = jasmine.createSpyObj<SongDataService>('SongDataService', ['read$']);
    userServiceSpy = jasmine.createSpyObj<UserService>('UserService', ['incSongCount', 'decSongCount'], {
      user$: user$.asObservable(),
    });
    showServiceSpy = jasmine.createSpyObj<ShowService>('ShowService', ['read$', 'update$']);

    showSongDataServiceSpy.add.and.resolveTo('show-song-2');
    showSongDataServiceSpy.read$.and.returnValue(of(showSong));
    showSongDataServiceSpy.list$.and.returnValue(of([showSong]));
    showSongDataServiceSpy.delete.and.resolveTo();
    showSongDataServiceSpy.update$.and.resolveTo();
    songDataServiceSpy.read$.and.returnValue(of(song));
    userServiceSpy.incSongCount.and.resolveTo();
    userServiceSpy.decSongCount.and.resolveTo();
    showServiceSpy.read$.and.returnValue(of(show));
    showServiceSpy.update$.and.resolveTo();

    await TestBed.configureTestingModule({
      providers: [
        {provide: ShowSongDataService, useValue: showSongDataServiceSpy},
        {provide: SongDataService, useValue: songDataServiceSpy},
        {provide: UserService, useValue: userServiceSpy},
        {provide: ShowService, useValue: showServiceSpy},
      ],
    });

    service = TestBed.inject(ShowSongService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a show song from the song and current user', async () => {
    await expectAsync(service.new$('show-1', 'song-1', true)).toBeResolvedTo('show-song-2');

    expect(userServiceSpy.incSongCount).toHaveBeenCalledWith('song-1');
    expect(showSongDataServiceSpy.add).toHaveBeenCalledWith('show-1', {
      ...song,
      songId: 'song-1',
      key: 'G',
      keyOriginal: 'G',
      chordMode: 'letters',
      addedLive: true,
    });
  });

  it('should return null when the song is missing', async () => {
    songDataServiceSpy.read$.and.returnValue(of(null));

    await expectAsync(service.new$('show-1', 'song-1')).toBeResolvedTo(null);

    expect(showSongDataServiceSpy.add).not.toHaveBeenCalled();
    expect(userServiceSpy.incSongCount).not.toHaveBeenCalled();
  });

  it('should return null when the current user is missing', async () => {
    user$.next(null);

    await expectAsync(service.new$('show-1', 'song-1')).toBeResolvedTo(null);

    expect(showSongDataServiceSpy.add).not.toHaveBeenCalled();
    expect(userServiceSpy.incSongCount).not.toHaveBeenCalled();
  });

  it('should delegate reads to the data service', async () => {
    await expectAsync(service.read('show-1', 'show-song-1')).toBeResolvedTo(showSong);
    expect(showSongDataServiceSpy.read$).toHaveBeenCalledWith('show-1', 'show-song-1');
  });

  it('should delegate list access to the data service', async () => {
    await expectAsync(service.list('show-1')).toBeResolvedTo([showSong]);
    expect(showSongDataServiceSpy.list$).toHaveBeenCalledWith('show-1');
  });

  it('should delete a show song, update the order and decrement song usage', async () => {
    await service.delete$('show-1', 'show-song-1', 0);

    expect(showSongDataServiceSpy.delete).toHaveBeenCalledWith('show-1', 'show-song-1');
    expect(showServiceSpy.update$).toHaveBeenCalledWith('show-1', {order: ['show-song-2']});
    expect(userServiceSpy.decSongCount).toHaveBeenCalledWith('song-1');
  });

  it('should stop delete when the show is missing', async () => {
    showServiceSpy.read$.and.returnValue(of(null));

    await service.delete$('show-1', 'show-song-1', 0);

    expect(showSongDataServiceSpy.delete).not.toHaveBeenCalled();
    expect(showServiceSpy.update$).not.toHaveBeenCalled();
    expect(userServiceSpy.decSongCount).not.toHaveBeenCalled();
  });

  it('should stop delete when the show song is missing', async () => {
    showSongDataServiceSpy.read$.and.returnValue(of(null));

    await service.delete$('show-1', 'show-song-1', 0);

    expect(showSongDataServiceSpy.delete).not.toHaveBeenCalled();
    expect(showServiceSpy.update$).not.toHaveBeenCalled();
    expect(userServiceSpy.decSongCount).not.toHaveBeenCalled();
  });

  it('should delegate updates to the data service', async () => {
    await service.update$('show-1', 'show-song-1', {title: 'Updated'} as never);

    expect(showSongDataServiceSpy.update$).toHaveBeenCalledWith('show-1', 'show-song-1', {title: 'Updated'} as never);
  });
});
