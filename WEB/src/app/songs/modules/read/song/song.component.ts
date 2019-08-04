import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Song} from '../../../models/song.model';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
    selector: 'app-song',
    templateUrl: './song.component.html',
})
export class SongComponent {

    constructor(private route: ActivatedRoute) {
    }

    public get song(): Observable<Song> {
        return this.route.data.pipe(map((data: { song: Song }) => data.song));
    }
}
