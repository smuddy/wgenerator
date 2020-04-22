import {Injectable} from '@angular/core';
import {DbService} from './db.service';
import {GlobalSettings} from './global-settings';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalSettingsService {
  constructor(private db: DbService) {
  }

  public get get$(): Observable<GlobalSettings> {
    return this.db.doc$<GlobalSettings>('global/static');
  }

  public async set(data: Partial<GlobalSettings>) {
    await this.db.doc<GlobalSettings>('global/static').update(data);
  }

}
