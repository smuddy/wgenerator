import {TestBed} from '@angular/core/testing';
import {firstValueFrom, Subject} from 'rxjs';
import {take, toArray} from 'rxjs/operators';
import {DbService} from '../../../services/db.service';
import {SongDataService} from './song-data.service';

describe('SongDataService', () => {
  let service: SongDataService;
  let songs$: Subject<Array<{id: string; title: string}>>;
  let docUpdateSpy: jasmine.Spy<() => Promise<void>>;
  let docDeleteSpy: jasmine.Spy<() => Promise<void>>;
  let docSpy: jasmine.Spy;
  let colAddSpy: jasmine.Spy<() => Promise<{id: string}>>;
  let colSpy: jasmine.Spy;
  let dbServiceSpy: jasmine.SpyObj<DbService>;

  beforeEach(async () => {
    songs$ = new Subject<Array<{id: string; title: string}>>();
    docUpdateSpy = jasmine.createSpy('update').and.resolveTo();
    docDeleteSpy = jasmine.createSpy('delete').and.resolveTo();
    docSpy = jasmine.createSpy('doc').and.callFake(() => ({
      update: docUpdateSpy,
      delete: docDeleteSpy,
    }));
    colAddSpy = jasmine.createSpy('add').and.resolveTo({id: 'song-3'});
    colSpy = jasmine.createSpy('col').and.returnValue({
      add: colAddSpy,
    });
    dbServiceSpy = jasmine.createSpyObj<DbService>('DbService', ['col$', 'doc$', 'doc', 'col']);
    dbServiceSpy.col$.and.returnValue(songs$.asObservable());
    dbServiceSpy.doc$.and.returnValue(songs$.asObservable() as never);
    dbServiceSpy.doc.and.callFake(docSpy);
    dbServiceSpy.col.and.callFake(colSpy);

    await TestBed.configureTestingModule({
      providers: [{provide: DbService, useValue: dbServiceSpy}],
    });

    service = TestBed.inject(SongDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load songs from the songs collection once on creation', () => {
    expect(dbServiceSpy.col$).toHaveBeenCalledTimes(1);
    expect(dbServiceSpy.col$).toHaveBeenCalledWith('songs');
  });

  it('should emit an empty list first and then the loaded songs', async () => {
    const emissionsPromise = firstValueFrom(service.list$.pipe(take(2), toArray()));

    songs$.next([{id: 'song-1', title: 'Amazing Grace'}]);

    const emissions = await emissionsPromise;

    expect(emissions[0]).toEqual([]);
    expect(emissions[1].map(song => song.id)).toEqual(['song-1']);
    expect(emissions[1].map(song => song.title)).toEqual(['Amazing Grace']);
  });

  it('should replay the latest songs to late subscribers', async () => {
    const initialSubscription = service.list$.subscribe();

    songs$.next([{id: 'song-2', title: 'How Great'}]);

    const latestSongs = await firstValueFrom(service.list$.pipe(take(1)));

    expect(latestSongs.map(song => song.id)).toEqual(['song-2']);
    expect(latestSongs.map(song => song.title)).toEqual(['How Great']);

    initialSubscription.unsubscribe();
  });

  it('should read a single song by id', () => {
    service.read$('song-7');

    expect(dbServiceSpy.doc$).toHaveBeenCalledWith('songs/song-7');
  });

  it('should update a song at the expected document path', async () => {
    await service.update$('song-8', {title: 'Updated'});

    expect(docSpy).toHaveBeenCalledWith('songs/song-8');
    const [updatePayload] = docUpdateSpy.calls.mostRecent().args as unknown as [Record<string, unknown>];
    expect(updatePayload).toEqual({title: 'Updated'});
  });

  it('should add a song to the songs collection and return the new id', async () => {
    await expectAsync(service.add({title: 'New Song'})).toBeResolvedTo('song-3');

    expect(colSpy).toHaveBeenCalledWith('songs');
    const [addPayload] = colAddSpy.calls.mostRecent().args as unknown as [Record<string, unknown>];
    expect(addPayload).toEqual({title: 'New Song'});
  });

  it('should delete a song at the expected document path', async () => {
    await service.delete('song-9');

    expect(docSpy).toHaveBeenCalledWith('songs/song-9');
    expect(docDeleteSpy).toHaveBeenCalled();
  });
});
