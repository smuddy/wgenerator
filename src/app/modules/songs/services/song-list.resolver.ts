import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {SongService} from './song.service';
import {Song} from './song';
import {filter} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SongListResolver {
  public constructor(private songService: SongService) {}

  public resolve(): Observable<Song[]> {
    return this.songService.list$().pipe(filter(_ => _.length > 0));
  }
}
