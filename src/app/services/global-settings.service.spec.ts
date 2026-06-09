import {TestBed} from '@angular/core/testing';
import {firstValueFrom, of} from 'rxjs';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {DbService} from './db.service';
import {GlobalSettingsService} from './global-settings.service';

describe('GlobalSettingsService', () => {
  let service: GlobalSettingsService;
  let dbServiceSpy: {doc$: ReturnType<typeof vi.fn>; doc: ReturnType<typeof vi.fn>};
  let updateSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    updateSpy = vi.fn().mockResolvedValue(undefined);
    dbServiceSpy = {doc$: vi.fn(), doc: vi.fn()};
    dbServiceSpy.doc$.mockReturnValue(of({churchName: 'ICF'}) as never);
    dbServiceSpy.doc.mockReturnValue({update: updateSpy} as never);

    await TestBed.configureTestingModule({
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

  it('should expose the shared settings stream via the getter', async () => {
    await expect(firstValueFrom(service.get$)).resolves.toEqual({churchName: 'ICF'} as never);
  });

  it('should update the static global settings document', async () => {
    await service.set({churchName: 'New Name'} as never);

    expect(dbServiceSpy.doc).toHaveBeenCalledWith('global/static');
    expect(updateSpy).toHaveBeenCalledWith({churchName: 'New Name'} as never);
  });
});
