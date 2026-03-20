import {TestBed} from '@angular/core/testing';
import {Firestore} from '@angular/fire/firestore';
import {of} from 'rxjs';
import {DbService} from 'src/app/services/db.service';
import {GuestShowDataService} from './guest-show-data.service';

describe('GuestShowDataService', () => {
  let service: GuestShowDataService;
  let docUpdateSpy: jasmine.Spy<() => Promise<void>>;
  let docDeleteSpy: jasmine.Spy<() => Promise<void>>;
  let docSpy: jasmine.Spy;
  let colAddSpy: jasmine.Spy<() => Promise<{id: string}>>;
  let colSpy: jasmine.Spy;
  let dbServiceSpy: jasmine.SpyObj<DbService>;
  let firestoreStub: Firestore;

  beforeEach(async () => {
    docUpdateSpy = jasmine.createSpy('update').and.resolveTo();
    docDeleteSpy = jasmine.createSpy('delete').and.resolveTo();
    docSpy = jasmine.createSpy('doc').and.returnValue({
      update: docUpdateSpy,
      delete: docDeleteSpy,
    });
    colAddSpy = jasmine.createSpy('add').and.resolveTo({id: 'guest-2'});
    colSpy = jasmine.createSpy('col').and.returnValue({add: colAddSpy});
    dbServiceSpy = jasmine.createSpyObj<DbService>('DbService', ['col$', 'doc$', 'doc', 'col']);
    dbServiceSpy.col$.and.returnValue(of([{id: 'guest-1'}]) as never);
    dbServiceSpy.doc$.and.returnValue(of({id: 'guest-1'}) as never);
    dbServiceSpy.doc.and.callFake(docSpy);
    dbServiceSpy.col.and.callFake(colSpy);
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
    const [updatePayload] = docUpdateSpy.calls.mostRecent().args as unknown as [Record<string, unknown>];
    expect(updatePayload).toEqual({published: true});
  });

  it('should add a guest show and return the created id', async () => {
    await expectAsync(service.add({published: false} as never)).toBeResolvedTo('guest-2');

    expect(colSpy).toHaveBeenCalledWith('guest');
    const [addPayload] = colAddSpy.calls.mostRecent().args as unknown as [Record<string, unknown>];
    expect(addPayload).toEqual({published: false});
  });

  it('should delete a guest show document', async () => {
    await service.delete('guest-7');

    expect(docSpy).toHaveBeenCalledWith('guest/guest-7');
    expect(docDeleteSpy).toHaveBeenCalled();
  });
});
