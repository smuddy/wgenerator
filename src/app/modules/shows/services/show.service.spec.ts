import {TestBed} from '@angular/core/testing';
import {BehaviorSubject, of} from 'rxjs';
import {ShowDataService} from './show-data.service';
import {ShowService} from './show.service';
import {UserService} from '../../../services/user/user.service';

describe('ShowService', () => {
  let service: ShowService;
  let showDataServiceSpy: jasmine.SpyObj<ShowDataService>;
  let user$: BehaviorSubject<unknown>;
  const shows = [
    {id: 'show-1', owner: 'user-1', published: false, archived: false},
    {id: 'show-2', owner: 'other-user', published: true, archived: false},
    {id: 'show-3', owner: 'user-1', published: true, archived: true},
  ] as never;

  beforeEach(async () => {
    user$ = new BehaviorSubject<unknown>({id: 'user-1'});
    showDataServiceSpy = jasmine.createSpyObj<ShowDataService>(
      'ShowDataService',
      ['read$', 'listPublicSince$', 'update', 'add'],
      {list$: of(shows) as unknown as ShowDataService['list$']}
    );
    showDataServiceSpy.read$.and.returnValue(of(shows[0]));
    showDataServiceSpy.listPublicSince$.and.returnValue(of([shows[1]]));
    showDataServiceSpy.update.and.resolveTo();
    showDataServiceSpy.add.and.resolveTo('new-show-id');

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

  it('should list published shows and own drafts, but exclude archived ones', done => {
    service.list$().subscribe(result => {
      expect(result.map(show => show.id)).toEqual(['show-1', 'show-2']);
      done();
    });
  });

  it('should filter out private drafts when publishedOnly is true', done => {
    service.list$(true).subscribe(result => {
      expect(result.map(show => show.id)).toEqual(['show-2']);
      done();
    });
  });

  it('should delegate public listing to the data service', done => {
    service.listPublicSince$(6).subscribe(result => {
      expect(result).toEqual([shows[1]]);
      expect(showDataServiceSpy.listPublicSince$).toHaveBeenCalledWith(6);
      done();
    });
  });

  it('should delegate reads to the data service', done => {
    service.read$('show-1').subscribe(result => {
      expect(result).toEqual(shows[0]);
      expect(showDataServiceSpy.read$).toHaveBeenCalledWith('show-1');
      done();
    });
  });

  it('should delegate updates to the data service', async () => {
    await service.update$('show-1', {published: true});

    expect(showDataServiceSpy.update).toHaveBeenCalledWith('show-1', {published: true});
  });

  it('should return null when creating a show without showType', async () => {
    await expectAsync(service.new$({published: true})).toBeResolvedTo(null);

    expect(showDataServiceSpy.add).not.toHaveBeenCalled();
  });

  it('should return null when no user is available for show creation', async () => {
    user$.next(null);

    await expectAsync(service.new$({showType: 'misc-public'})).toBeResolvedTo(null);

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
