import {TestBed} from '@angular/core/testing';
import {GuestShowDataService} from './guest-show-data.service';
import {GuestShowService} from './guest-show.service';
import {ShowService} from '../shows/services/show.service';
import {Show} from '../shows/services/show';
import {Song} from '../songs/services/song';

describe('GuestShowService', () => {
  let service: GuestShowService;
  let guestShowDataServiceSpy: jasmine.SpyObj<GuestShowDataService>;
  let showServiceSpy: jasmine.SpyObj<ShowService>;

  beforeEach(async () => {
    guestShowDataServiceSpy = jasmine.createSpyObj<GuestShowDataService>('GuestShowDataService', ['add', 'update$']);
    showServiceSpy = jasmine.createSpyObj<ShowService>('ShowService', ['update$']);
    guestShowDataServiceSpy.add.and.resolveTo('share-1');
    guestShowDataServiceSpy.update$.and.resolveTo();
    showServiceSpy.update$.and.resolveTo();

    await TestBed.configureTestingModule({
      providers: [
        {provide: GuestShowDataService, useValue: guestShowDataServiceSpy},
        {provide: ShowService, useValue: showServiceSpy},
      ],
    });

    service = TestBed.inject(GuestShowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a new guest share, persist the generated shareId on the show and return the share url', async () => {
    const show = {id: 'show-1', showType: 'service-worship', date: new Date(), shareId: ''} as unknown as Show;
    const songs = [{id: 'song-1'}] as unknown as Song[];
    const expectedUrl = window.location.protocol + '//' + window.location.host + '/guest/share-1';

    await expectAsync(service.share(show, songs)).toBeResolvedTo(expectedUrl);

    expect(guestShowDataServiceSpy.add).toHaveBeenCalledWith({
      showType: 'service-worship',
      date: show.date,
      songs,
    });
    expect(showServiceSpy.update$).toHaveBeenCalledWith('show-1', {shareId: 'share-1'});
  });

  it('should update an existing share and reuse its id in the returned url', async () => {
    const show = {id: 'show-1', showType: 'service-worship', date: new Date(), shareId: 'share-9'} as unknown as Show;
    const songs = [{id: 'song-1'}] as unknown as Song[];
    const expectedUrl = window.location.protocol + '//' + window.location.host + '/guest/share-9';

    await expectAsync(service.share(show, songs)).toBeResolvedTo(expectedUrl);

    expect(guestShowDataServiceSpy.update$).toHaveBeenCalledWith('share-9', {
      showType: 'service-worship',
      date: show.date,
      songs,
    });
    expect(guestShowDataServiceSpy.add).not.toHaveBeenCalled();
    expect(showServiceSpy.update$).not.toHaveBeenCalled();
  });
});
