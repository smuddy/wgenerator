import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {SongDataService} from './song-data.service';
import {SongService} from './song.service';
import {UserService} from '../../../services/user/user.service';
import {Timestamp} from '@angular/fire/firestore';

describe('SongService', () => {
  let service: SongService;
  let songDataServiceSpy: jasmine.SpyObj<SongDataService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  const song = {
    id: 'song-1',
    title: 'Amazing Grace',
    edits: [],
  } as never;

  beforeEach(async () => {
    songDataServiceSpy = jasmine.createSpyObj<SongDataService>('SongDataService', ['read$', 'update$', 'add', 'delete'], {
      list$: of([song]),
    });
    userServiceSpy = jasmine.createSpyObj<UserService>('UserService', ['currentUser']);

    songDataServiceSpy.read$.and.returnValue(of(song));
    songDataServiceSpy.update$.and.resolveTo();
    songDataServiceSpy.add.and.resolveTo('song-2');
    songDataServiceSpy.delete.and.resolveTo();
    userServiceSpy.currentUser.and.resolveTo({name: 'Benjamin'} as never);

    await TestBed.configureTestingModule({
      providers: [
        {provide: SongDataService, useValue: songDataServiceSpy},
        {provide: UserService, useValue: userServiceSpy},
      ],
    });

    service = TestBed.inject(SongService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list songs from the data service', done => {
    service.list$().subscribe(songs => {
      expect(songs).toEqual([song]);
      done();
    });
  });

  it('should delegate reads to the data service', async () => {
    await expectAsync(service.read('song-1')).toBeResolvedTo(song);
    expect(songDataServiceSpy.read$).toHaveBeenCalledWith('song-1');
  });

  it('should append an edit with the current user when updating a song', async () => {
    const timestamp = {seconds: 1} as never;
    spyOn(Timestamp, 'now').and.returnValue(timestamp);

    await service.update$('song-1', {title: 'Updated'});

    expect(songDataServiceSpy.update$).toHaveBeenCalled();
    const [, payload] = songDataServiceSpy.update$.calls.mostRecent().args as unknown as [string, Record<string, unknown>];
    expect(payload.title).toBe('Updated');
    expect(payload.edits).toEqual([{username: 'Benjamin', timestamp}]);
  });

  it('should not update when the song does not exist', async () => {
    songDataServiceSpy.read$.and.returnValue(of(null));

    await service.update$('missing-song', {title: 'Updated'});

    expect(songDataServiceSpy.update$).not.toHaveBeenCalled();
  });

  it('should not update when no current user is available', async () => {
    userServiceSpy.currentUser.and.resolveTo(null);

    await service.update$('song-1', {title: 'Updated'});

    expect(songDataServiceSpy.update$).not.toHaveBeenCalled();
  });

  it('should create new songs with the expected defaults', async () => {
    await expectAsync(service.new(42, 'New Song')).toBeResolvedTo('song-2');

    expect(songDataServiceSpy.add).toHaveBeenCalledWith({
      number: 42,
      title: 'New Song',
      status: 'draft',
      legalType: 'open',
    });
  });

  it('should delete songs via the data service', async () => {
    await service.delete('song-1');

    expect(songDataServiceSpy.delete).toHaveBeenCalledWith('song-1');
  });
});
