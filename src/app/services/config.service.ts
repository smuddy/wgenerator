import {Injectable} from '@angular/core';
import {DbService} from './db.service';
import {Observable} from 'rxjs';
import {Config} from './config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  constructor(private db: DbService) {
  }

  public get get$(): Observable<Config> {
    return this.db.doc$<Config>('global/config');
  }
}
