import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Song } from '../models/song.model';
import { SongsService } from './songs.service';

@Injectable({
  providedIn: 'root'
})
export class SongResolverService implements Resolve<Song> {

  constructor(private songsService: SongsService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Song> {
    const id = route.params.id;
    const get$ = this.songsService.get<Song>(id);
    return get$;
  }
}
