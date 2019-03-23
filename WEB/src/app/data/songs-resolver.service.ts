import { Song } from './../models/song.model';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SongsService } from './songs.service';

@Injectable({
  providedIn: 'root'
})
export class SongsResolverService implements Resolve<Song[]> {

  constructor(private songsService: SongsService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Song[]> {
    const get$ = this.songsService.list<Song>();
    return get$;
  }
}
