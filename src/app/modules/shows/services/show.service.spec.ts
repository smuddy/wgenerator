import {TestBed} from '@angular/core/testing';
import {BehaviorSubject, firstValueFrom, of} from 'rxjs';
import {vi} from 'vitest';
import {ShowDataService} from './show-data.service';
import {ShowService} from './show.service';
import {UserService} from '../../../services/user/user.service';

describe('ShowService', () => {
  let service: ShowService;
  let showDataServiceSpy: {
    read$: ReturnType<typeof vi.fn>;
    listPublicSince$: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    add: ReturnType<typeof vi.fn>;
    list$: ReturnType<BehaviorSubject<unknown[]>['asObservable']>;
  };
  let user$: BehaviorSubject<unknown>;
  let shows$: BehaviorSubject<unknown[]>;
  const shows = [
    {id: 'show-1', owner: 'user-1', published: false, archived: false},
    {id: 'show-2', owner: 'other-user', published: true, archived: false},
    {id: 'show-3', owner: 'user-1', published: true, archived: true},
  ] as never;

  beforeEach(async () => {
    user$ = new BehaviorSubject<unknown>({id: 'user-1'});
    shows$ = new BehaviorSubject<unknown[]>(shows as unknown[]);
    showDataServiceSpy = {
      read$: vi.fn(),
      listPublicSince$: vi.fn(),
      update: vi.fn(),
      add: vi.fn(),
      list$: shows$.asObservable() as unknown as ShowDataService['list$'],
    };
    showDataServiceSpy.read$.mockReturnValue(of(shows[0]));
    showDataServiceSpy.listPublicSince$.mockReturnValue(of([shows[1]]));
    showDataServiceSpy.update.mockResolvedValue(undefined);
    showDataServiceSpy.add.mockResolvedValue('new-show-id');

    await TestBed.configureTestingModule({
      providers: [
        {provide: ShowDataService, useValue: showDataServiceSpy},
        {provide: UserService, useValue: {user$: user$.asObservable()}},
      ],
    });

    service = TestBed.inject(ShowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list published shows and own drafts, but exclude archived ones', async () => {
    const result = await firstValueFrom(service.list$());
    expect(result.map(show => show.id)).toEqual(['show-1', 'show-2']);
  });

  it('should filter out private drafts when publishedOnly is true', async () => {
    const result = await firstValueFrom(service.list$(true));
    expect(result.map(show => show.id)).toEqual(['show-2']);
  });

  it('should include own archived shows when requested', async () => {
    const result = await firstValueFrom(service.list$(false, true));
    expect(result.map(show => show.id)).toEqual(['show-1', 'show-2', 'show-3']);
  });

  it('should not include archived shows from other users when requested', async () => {
    shows$.next([...(shows as unknown as unknown[]), {id: 'show-4', owner: 'other-user', published: true, archived: true}]);

    const result = await firstValueFrom(service.list$(false, true));
    expect(result.map(show => show.id)).toEqual(['show-1', 'show-2', 'show-3']);
  });

  it('should delegate public listing to the data service', async () => {
    await expect(firstValueFrom(service.listPublicSince$(6))).resolves.toEqual([shows[1]]);
    expect(showDataServiceSpy.listPublicSince$).toHaveBeenCalledWith(6);
  });

  it('should delegate reads to the data service', async () => {
    await expect(firstValueFrom(service.read$('show-1'))).resolves.toBe(shows[0]);
    expect(showDataServiceSpy.read$).toHaveBeenCalledWith('show-1');
  });

  it('should delegate updates to the data service', async () => {
    await service.update$('show-1', {published: true});

    expect(showDataServiceSpy.update).toHaveBeenCalledWith('show-1', {published: true});
  });

  it('should return null when creating a show without showType', async () => {
    await expect(service.new$({published: true})).resolves.toBe(null);

    expect(showDataServiceSpy.add).not.toHaveBeenCalled();
  });

  it('should return null when no user is available for show creation', async () => {
    user$.next(null);

    await expect(service.new$({showType: 'misc-public'})).resolves.toBe(null);

    expect(showDataServiceSpy.add).not.toHaveBeenCalled();
  });

  ShowService.SHOW_TYPE_PUBLIC.forEach(type => {
    it('should calc public flag for ' + type, async () => {
      const id = await service.new$({showType: type});

      expect(id).toBe('new-show-id');
      expect(showDataServiceSpy.add).toHaveBeenCalledWith({
        showType: type,
        owner: 'user-1',
        order: [],
        songIds: [],
        public: true,
      });
    });
  });

  ShowService.SHOW_TYPE_PRIVATE.forEach(type => {
    it('should calc private flag for ' + type, async () => {
      const id = await service.new$({showType: type});

      expect(id).toBe('new-show-id');
      expect(showDataServiceSpy.add).toHaveBeenCalledWith({
        showType: type,
        owner: 'user-1',
        order: [],
        songIds: [],
        public: false,
      });
    });
  });
});
