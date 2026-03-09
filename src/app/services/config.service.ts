import {Injectable} from '@angular/core';
import {DbService} from './db.service';
import {firstValueFrom, Observable} from 'rxjs';
import {Config} from './config';
import {shareReplay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly config$ = this.db.doc$<Config>('global/config').pipe(
    shareReplay({
      bufferSize: 1,
      refCount: true,
    })
  );

  public constructor(private db: DbService) {}

  public get$ = (): Observable<Config | null> => this.config$;
  public get = (): Promise<Config | null> => firstValueFrom(this.get$());
}
