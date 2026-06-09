import {TestBed} from '@angular/core/testing';
import {firstValueFrom, of} from 'rxjs';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {DbService} from './db.service';
import {ConfigService} from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;
  let dbServiceSpy: {doc$: ReturnType<typeof vi.fn>};

  beforeEach(async () => {
    dbServiceSpy = {doc$: vi.fn()};
    dbServiceSpy.doc$.mockReturnValue(of({copyright: 'CCLI'}) as never);

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

  it('should expose the shared config stream via get$', async () => {
    await expect(firstValueFrom(service.get$())).resolves.toEqual({copyright: 'CCLI'} as never);
  });

  it('should resolve the current config via get()', async () => {
    await expect(service.get()).resolves.toEqual({copyright: 'CCLI'} as never);
  });
});
