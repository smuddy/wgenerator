import {ApplicationRef, DestroyRef, Injectable, NgZone, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SwUpdate} from '@angular/service-worker';
import {concat, filter, first, fromEvent, interval, merge} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AppUpdateService {
  private readonly updates = inject(SwUpdate, {optional: true});
  private readonly snackBar = inject(MatSnackBar);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private checking = false;
  private prompted = false;

  constructor() {
    if (!this.updates?.isEnabled) {
      return;
    }

    this.updates.versionUpdates.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event.type === 'VERSION_READY') {
        this.promptReload('Eine neue Version ist verfügbar.');
      }
    });
    this.updates.unrecoverable.pipe(takeUntilDestroyed()).subscribe(() => {
      this.promptReload('Die Anwendung muss neu geladen werden.');
    });

    const appRef = inject(ApplicationRef);
    // Poll only after stabilization so service worker registration is not delayed.
    this.zone.runOutsideAngular(() => {
      concat(
        appRef.isStable.pipe(first(stable => stable)),
        merge(
          interval(15 * 60 * 1000),
          fromEvent(window, 'online'),
          fromEvent(document, 'visibilitychange').pipe(filter(() => document.visibilityState === 'visible'))
        )
      )
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => void this.checkForUpdate());
    });
  }

  private async checkForUpdate(): Promise<void> {
    if (this.checking) {
      return;
    }
    this.checking = true;
    try {
      await this.updates?.checkForUpdate();
    } catch (error) {
      // Offline clients retry when connectivity returns or on the next interval.
      console.warn('Aktualisierung konnte nicht geprüft werden.', error);
    } finally {
      this.checking = false;
    }
  }

  private promptReload(message: string): void {
    if (this.prompted) {
      return;
    }
    this.prompted = true;
    this.zone.run(() => {
      this.snackBar
        .open(message, 'Jetzt aktualisieren', {duration: 0})
        .onAction()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => window.location.reload());
    });
  }
}
