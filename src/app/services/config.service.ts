import {Injectable} from '@angular/core';
import {DbService} from './db.service';
import {firstValueFrom, Observable} from 'rxjs';
import {Config} from './config';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public constructor(private db: DbService) {}

  public get$ = (): Observable<Config | null> => this.db.doc$<Config>('global/config');
  public get = (): Promise<Config | null> => firstValueFrom(this.get$());

}
