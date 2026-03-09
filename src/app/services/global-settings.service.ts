import {Injectable, inject} from '@angular/core';
import {DbService} from './db.service';
import {GlobalSettings} from './global-settings';
import {Observable} from 'rxjs';
import {shareReplay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GlobalSettingsService {
  private db = inject(DbService);

  private readonly settings$ = this.db.doc$<GlobalSettings>('global/static').pipe(
    shareReplay({
      bufferSize: 1,
      refCount: true,
    })
  );

  public get get$(): Observable<GlobalSettings | null> {
    return this.settings$;
  }

  public async set(data: Partial<GlobalSettings>): Promise<void> {
    await this.db.doc<GlobalSettings>('global/static').update(data);
  }
}
