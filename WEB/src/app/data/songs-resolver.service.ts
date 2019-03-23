import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SongListModel } from '../models/song-list.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { urlSongs } from './urls';

@Injectable({
  providedIn: 'root'
})
export class SongsResolverService implements Resolve<SongListModel> {

  constructor(private httpClient: HttpClient) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SongListModel> {
    const get$ = this.httpClient.get<SongListModel>(urlSongs);
    return get$;
  }
}
