import {Injectable, inject} from '@angular/core';

import {Observable} from 'rxjs';
import {SongService} from './song.service';
import {Song} from './song';
import {take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SongListResolver {
  private songService = inject(SongService);

  public resolve(): Observable<Song[]> {
    return this.songService.listLoaded$().pipe(take(1));
  }
}
