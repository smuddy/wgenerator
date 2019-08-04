import {Injectable} from '@angular/core';
import {Song} from './models/song.model';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ODataBaseService} from '../data/ODataBaseService';
import {ODataService} from 'odata-v4-ng';

@Injectable({
    providedIn: 'root'
})
export class SongResolver extends ODataBaseService implements Resolve<Song> {

    constructor(odataService: ODataService) {
        super(odataService, 'songs');
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Song> {
        const id = +route.params.songId;
        const get$ = this.get$<Song>(
            id,
            ['ID', 'Name', 'Text', 'Comments', 'SongType', 'Key', 'Tempo'],
            ['Files']
        );

        return get$;
    }

}
