import {ApplicationRef} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SwUpdate, VersionEvent} from '@angular/service-worker';
import {Subject} from 'rxjs';
import {vi} from 'vitest';
import {AppUpdateService} from './app-update.service';

describe('AppUpdateService', () => {
  let stable: Subject<boolean>;
  let versions: Subject<VersionEvent>;
  let updates: {isEnabled: boolean; versionUpdates: Subject<VersionEvent>; unrecoverable: Subject<unknown>; checkForUpdate: ReturnType<typeof vi.fn>};
  let snackBar: {open: ReturnType<typeof vi.fn>};

  beforeEach(() => {
    stable = new Subject();
    versions = new Subject();
    updates = {isEnabled: true, versionUpdates: versions, unrecoverable: new Subject(), checkForUpdate: vi.fn().mockResolvedValue(false)};
    snackBar = {open: vi.fn().mockReturnValue({onAction: () => new Subject()})};
    TestBed.configureTestingModule({
      providers: [
        {provide: ApplicationRef, useValue: {isStable: stable}},
        {provide: SwUpdate, useValue: updates},
        {provide: MatSnackBar, useValue: snackBar},
      ],
    });
  });

  it('waits for stability and checks again when connectivity returns', async () => {
    TestBed.inject(AppUpdateService);
    stable.next(false);
    expect(updates.checkForUpdate).not.toHaveBeenCalled();
    stable.next(true);
    expect(updates.checkForUpdate).toHaveBeenCalledTimes(1);
    await Promise.resolve();
    window.dispatchEvent(new Event('online'));
    expect(updates.checkForUpdate).toHaveBeenCalledTimes(2);
    TestBed.resetTestingModule();
    window.dispatchEvent(new Event('online'));
    expect(updates.checkForUpdate).toHaveBeenCalledTimes(2);
  });

  it('does not check when the service worker is disabled', () => {
    updates.isEnabled = false;
    TestBed.inject(AppUpdateService);
    stable.next(true);
    window.dispatchEvent(new Event('online'));
    expect(updates.checkForUpdate).not.toHaveBeenCalled();
  });

  it('offers a persistent reload action only after the update is ready', () => {
    TestBed.inject(AppUpdateService);
    versions.next({type: 'VERSION_DETECTED', version: {hash: 'new'}});
    expect(snackBar.open).not.toHaveBeenCalled();
    const ready: VersionEvent = {type: 'VERSION_READY', currentVersion: {hash: 'old'}, latestVersion: {hash: 'new'}};
    versions.next(ready);
    versions.next(ready);
    expect(snackBar.open).toHaveBeenCalledExactlyOnceWith('Eine neue Version ist verfügbar.', 'Jetzt aktualisieren', {duration: 0});
  });

  it('offers recovery when cached application files cannot be recovered', () => {
    TestBed.inject(AppUpdateService);
    updates.unrecoverable.next({reason: 'Missing chunk'});
    expect(snackBar.open).toHaveBeenCalledWith('Die Anwendung muss neu geladen werden.', 'Jetzt aktualisieren', {duration: 0});
  });
});
