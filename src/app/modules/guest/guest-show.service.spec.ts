import {TestBed} from '@angular/core/testing';
import {GuestShowDataService} from './guest-show-data.service';
import {GuestShowService} from './guest-show.service';
import {ShowService} from '../shows/services/show.service';
import {Show} from '../shows/services/show';
import {Song} from '../songs/services/song';
import {beforeEach, describe, expect, it, vi} from 'vitest';

describe('GuestShowService', () => {
  let service: GuestShowService;
  let guestShowDataServiceSpy: {add: ReturnType<typeof vi.fn>; update$: ReturnType<typeof vi.fn>};
  let showServiceSpy: {update$: ReturnType<typeof vi.fn>};

  beforeEach(async () => {
    guestShowDataServiceSpy = {add: vi.fn(), update$: vi.fn()};
    showServiceSpy = {update$: vi.fn()};
    guestShowDataServiceSpy.add.mockResolvedValue('share-1');
    guestShowDataServiceSpy.update$.mockResolvedValue(undefined);
    showServiceSpy.update$.mockResolvedValue(undefined);

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

    await expect(service.share(show, songs)).resolves.toEqual(expectedUrl);

    const [addPayload] = guestShowDataServiceSpy.add.mock.calls.at(-1) as [Record<string, unknown>];
    expect(addPayload).toEqual(
      expect.objectContaining({
        showType: 'service-worship',
        date: show.date,
        songs,
      })
    );
    expect(addPayload['updatedAt']).toEqual(expect.any(Date));
    expect(showServiceSpy.update$).toHaveBeenCalledWith('show-1', {shareId: 'share-1'});
  });

  it('should update an existing share and reuse its id in the returned url', async () => {
    const show = {id: 'show-1', showType: 'service-worship', date: new Date(), shareId: 'share-9'} as unknown as Show;
    const songs = [{id: 'song-1'}] as unknown as Song[];
    const expectedUrl = window.location.protocol + '//' + window.location.host + '/guest/share-9';

    await expect(service.share(show, songs)).resolves.toEqual(expectedUrl);

    const [shareId, updatePayload] = guestShowDataServiceSpy.update$.mock.calls.at(-1) as [string, Record<string, unknown>];
    expect(shareId).toBe('share-9');
    expect(updatePayload).toEqual(
      expect.objectContaining({
        showType: 'service-worship',
        date: show.date,
        songs,
      })
    );
    expect(updatePayload['updatedAt']).toEqual(expect.any(Date));
    expect(guestShowDataServiceSpy.add).not.toHaveBeenCalled();
    expect(showServiceSpy.update$).not.toHaveBeenCalled();
  });
});
