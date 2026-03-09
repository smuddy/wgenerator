import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {DbService} from './db.service';
import {GlobalSettingsService} from './global-settings.service';

describe('GlobalSettingsService', () => {
  let service: GlobalSettingsService;
  let dbServiceSpy: jasmine.SpyObj<DbService>;
  let updateSpy: jasmine.Spy;

  beforeEach(() => {
    updateSpy = jasmine.createSpy('update').and.resolveTo();
    dbServiceSpy = jasmine.createSpyObj<DbService>('DbService', ['doc$', 'doc']);
    dbServiceSpy.doc$.and.returnValue(of({churchName: 'ICF'}) as never);
    dbServiceSpy.doc.and.returnValue({update: updateSpy} as never);

    void TestBed.configureTestingModule({
      providers: [{provide: DbService, useValue: dbServiceSpy}],
    });

    service = TestBed.inject(GlobalSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should read the static global settings document once on creation', () => {
    expect(dbServiceSpy.doc$).toHaveBeenCalledTimes(1);
    expect(dbServiceSpy.doc$).toHaveBeenCalledWith('global/static');
  });

  it('should expose the shared settings stream via the getter', done => {
    service.get$.subscribe(settings => {
      expect(settings).toEqual({churchName: 'ICF'} as never);
      done();
    });
  });

  it('should update the static global settings document', async () => {
    await service.set({churchName: 'New Name'} as never);

    expect(dbServiceSpy.doc).toHaveBeenCalledWith('global/static');
    expect(updateSpy).toHaveBeenCalledWith({churchName: 'New Name'} as never);
  });
});
