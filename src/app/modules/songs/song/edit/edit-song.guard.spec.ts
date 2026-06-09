import {TestBed} from '@angular/core/testing';
import {EditSongGuard} from './edit-song.guard';

describe('EditSongGuard', () => {
  let guard: EditSongGuard;

  beforeEach(async () => {
    await TestBed.configureTestingModule({});
    guard = TestBed.inject(EditSongGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow navigation when there is no nested editSongComponent', () => {
    const result = guard.canDeactivate({editSongComponent: null} as never, {} as never, {} as never, {} as never);

    expect(result).toBe(true);
  });

  it('should delegate to askForSave on the nested editSongComponent', async () => {
    const nextState = {url: '/songs'} as never;
    const askForSave = vi.fn().mockResolvedValue(true);

    const result = await guard.canDeactivate({editSongComponent: {askForSave}} as never, {} as never, {} as never, nextState);

    expect(askForSave).toHaveBeenCalledWith(nextState);
    expect(result).toBe(true);
  });
});
