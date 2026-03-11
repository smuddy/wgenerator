import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {DbService} from './db.service';
import {ConfigService} from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;
  let dbServiceSpy: jasmine.SpyObj<DbService>;

  beforeEach(async () => {
    dbServiceSpy = jasmine.createSpyObj<DbService>('DbService', ['doc$']);
    dbServiceSpy.doc$.and.returnValue(of({copyright: 'CCLI'}) as never);

    await TestBed.configureTestingModule({
      providers: [{provide: DbService, useValue: dbServiceSpy}],
    });

    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should read the global config document once on creation', () => {
    expect(dbServiceSpy.doc$).toHaveBeenCalledTimes(1);
    expect(dbServiceSpy.doc$).toHaveBeenCalledWith('global/config');
  });

  it('should expose the shared config stream via get$', done => {
    service.get$().subscribe(config => {
      expect(config).toEqual({copyright: 'CCLI'} as never);
      done();
    });
  });

  it('should resolve the current config via get()', async () => {
    await expectAsync(service.get()).toBeResolvedTo({copyright: 'CCLI'} as never);
  });
});
