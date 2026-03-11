import {TestBed} from '@angular/core/testing';
import {firstValueFrom, of, Subject} from 'rxjs';
import {take} from 'rxjs/operators';
import {DbService} from '../../../services/db.service';
import {ShowDataService} from './show-data.service';

describe('ShowDataService', () => {
  let service: ShowDataService;
  let shows$: Subject<Array<{id: string; date: {toMillis: () => number}; archived?: boolean}>>;
  let docUpdateSpy: jasmine.Spy<() => Promise<void>>;
  let docSpy: jasmine.Spy;
  let colAddSpy: jasmine.Spy<() => Promise<{id: string}>>;
  let colSpy: jasmine.Spy;
  let dbServiceSpy: jasmine.SpyObj<DbService>;

  beforeEach(async () => {
    shows$ = new Subject<Array<{id: string; date: {toMillis: () => number}; archived?: boolean}>>();
    docUpdateSpy = jasmine.createSpy('update').and.resolveTo();
    docSpy = jasmine.createSpy('doc').and.returnValue({update: docUpdateSpy});
    colAddSpy = jasmine.createSpy('add').and.resolveTo({id: 'show-3'});
    colSpy = jasmine.createSpy('col').and.returnValue({add: colAddSpy});
    dbServiceSpy = jasmine.createSpyObj<DbService>('DbService', ['col$', 'doc$', 'doc', 'col']);
    dbServiceSpy.col$.and.returnValue(shows$.asObservable());
    dbServiceSpy.doc$.and.returnValue(of(null));
    dbServiceSpy.doc.and.callFake(docSpy);
    dbServiceSpy.col.and.callFake(colSpy);

    await TestBed.configureTestingModule({
      providers: [{provide: DbService, useValue: dbServiceSpy}],
    });

    service = TestBed.inject(ShowDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load the raw show list from the shows collection on creation', () => {
    expect(dbServiceSpy.col$).toHaveBeenCalledWith('shows');
  });

  it('should sort the list by ascending show date', async () => {
    const listPromise = firstValueFrom(service.list$.pipe(take(1)));

    shows$.next([
      {id: 'show-2', date: {toMillis: () => 200}},
      {id: 'show-1', date: {toMillis: () => 100}},
      {id: 'show-3', date: {toMillis: () => 300}},
    ]);

    const list = await listPromise;

    expect(list.map(show => show.id)).toEqual(['show-1', 'show-2', 'show-3']);
  });

  it('should replay the latest sorted list to late subscribers', async () => {
    const initialSubscription = service.list$.subscribe();

    shows$.next([
      {id: 'show-2', date: {toMillis: () => 200}},
      {id: 'show-1', date: {toMillis: () => 100}},
    ]);

    const replayedList = await firstValueFrom(service.list$.pipe(take(1)));

    expect(replayedList.map(show => show.id)).toEqual(['show-1', 'show-2']);

    initialSubscription.unsubscribe();
  });

  it('should expose the raw list without sorting via listRaw$', () => {
    service.listRaw$().subscribe();

    expect(dbServiceSpy.col$).toHaveBeenCalledWith('shows');
  });

  it('should request only published recent shows and filter archived entries', async () => {
    const publicShows$ = of([{id: 'show-1', archived: false}, {id: 'show-2', archived: true}, {id: 'show-3'}]);
    dbServiceSpy.col$.and.returnValue(publicShows$ as never);

    const result = await firstValueFrom(service.listPublicSince$(3));

    expect(dbServiceSpy.col$).toHaveBeenCalledWith('shows', jasmine.any(Array));
    const [, queryConstraints] = dbServiceSpy.col$.calls.mostRecent().args as [string, unknown[]];
    expect(queryConstraints.length).toBe(3);
    expect(result.map(show => show.id)).toEqual(['show-1', 'show-3']);
  });

  it('should read a single show by id', () => {
    service.read$('show-7').subscribe();

    expect(dbServiceSpy.doc$).toHaveBeenCalledWith('shows/show-7');
  });

  it('should update a show at the expected document path', async () => {
    await service.update('show-8', {archived: true});

    expect(docSpy).toHaveBeenCalledWith('shows/show-8');
    const [updatePayload] = docUpdateSpy.calls.mostRecent().args as unknown as [Record<string, unknown>];
    expect(updatePayload).toEqual({archived: true});
  });

  it('should add a show to the shows collection and return the new id', async () => {
    await expectAsync(service.add({published: true})).toBeResolvedTo('show-3');

    expect(colSpy).toHaveBeenCalledWith('shows');
    const [addPayload] = colAddSpy.calls.mostRecent().args as unknown as [Record<string, unknown>];
    expect(addPayload).toEqual({published: true});
  });
});
