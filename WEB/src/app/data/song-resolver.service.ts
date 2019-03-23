import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { urlSongs } from './urls';
import { SongDetailModel } from '../models/song-list-detail.model';

@Injectable({
  providedIn: 'root'
})
export class SongResolverService implements Resolve<SongDetailModel> {

  constructor(private httpClient: HttpClient) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SongDetailModel> {
    const id = route.params.id;
    const get$ = this.httpClient.get<SongDetailModel>(urlSongs + '/' + id);
    return get$;
  }
}
