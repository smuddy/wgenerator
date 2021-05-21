import {Injectable} from '@angular/core';
import {DbService} from './db.service';
import {Observable} from 'rxjs';
import {Config} from './config';
import {first} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public constructor(private db: DbService) {}

  public get get$(): Observable<Config> {
    return this.db.doc$<Config>('global/config');
  }

  public async get(): Promise<Config> {
    return await this.db.doc$<Config>('global/config').pipe(first()).toPromise();
  }
}
