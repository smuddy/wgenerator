import {TestBed} from '@angular/core/testing';
import {Firestore} from '@angular/fire/firestore';
import {of} from 'rxjs';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {DbService} from 'src/app/services/db.service';
import {GuestShowDataService} from './guest-show-data.service';

describe('GuestShowDataService', () => {
  type DocumentRefStub = {update: ReturnType<typeof vi.fn>; delete: ReturnType<typeof vi.fn>};
  type CollectionRefStub = {add: ReturnType<typeof vi.fn>};
  type PathSpy<T> = ReturnType<typeof vi.fn> & ((path: string) => T);

  let service: GuestShowDataService;
  let docUpdateSpy: ReturnType<typeof vi.fn>;
  let docDeleteSpy: ReturnType<typeof vi.fn>;
  let docSpy: PathSpy<DocumentRefStub>;
  let colAddSpy: ReturnType<typeof vi.fn>;
  let colSpy: PathSpy<CollectionRefStub>;
  let dbServiceSpy: {col$: ReturnType<typeof vi.fn>; doc$: ReturnType<typeof vi.fn>; doc: ReturnType<typeof vi.fn>; col: ReturnType<typeof vi.fn>};
  let firestoreStub: Firestore;

  beforeEach(async () => {
    docUpdateSpy = vi.fn().mockResolvedValue(undefined);
    docDeleteSpy = vi.fn().mockResolvedValue(undefined);
    docSpy = vi.fn().mockReturnValue({
      update: docUpdateSpy,
      delete: docDeleteSpy,
    }) as PathSpy<DocumentRefStub>;
    colAddSpy = vi.fn().mockResolvedValue({id: 'guest-2'});
    colSpy = vi.fn().mockReturnValue({add: colAddSpy}) as PathSpy<CollectionRefStub>;
    dbServiceSpy = {col$: vi.fn(), doc$: vi.fn(), doc: docSpy, col: colSpy};
    dbServiceSpy.col$.mockReturnValue(of([{id: 'guest-1'}]) as never);
    dbServiceSpy.doc$.mockReturnValue(of({id: 'guest-1'}) as never);
    firestoreStub = {} as Firestore;

    await TestBed.configureTestingModule({
      providers: [
        {provide: DbService, useValue: dbServiceSpy},
        {provide: Firestore, useValue: firestoreStub},
      ],
    });

    service = TestBed.inject(GuestShowDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should read the guest collection for list$', () => {
    service.list$.subscribe();

    expect(dbServiceSpy.col$).toHaveBeenCalledWith('guest');
  });

  it('should read a single guest show by id', () => {
    service.read$('guest-7').subscribe();

    expect(dbServiceSpy.doc$).toHaveBeenCalledWith('guest/guest-7');
  });

  it('should update a guest show document', async () => {
    await service.update$('guest-7', {published: true} as never);

    expect(docSpy).toHaveBeenCalledWith('guest/guest-7');
    const [updatePayload] = docUpdateSpy.mock.calls.at(-1) as [Record<string, unknown>];
    expect(updatePayload).toEqual({published: true});
  });

  it('should add a guest show and return the created id', async () => {
    await expect(service.add({published: false} as never)).resolves.toEqual('guest-2');

    expect(colSpy).toHaveBeenCalledWith('guest');
    const [addPayload] = colAddSpy.mock.calls.at(-1) as [Record<string, unknown>];
    expect(addPayload).toEqual({published: false});
  });

  it('should delete a guest show document', async () => {
    await service.delete('guest-7');

    expect(docSpy).toHaveBeenCalledWith('guest/guest-7');
    expect(docDeleteSpy).toHaveBeenCalled();
  });
});
