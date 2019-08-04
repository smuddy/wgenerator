import {blend} from 'src/app/songs/services/animation';
import {Component} from '@angular/core';
import {SongsService} from 'src/app/data/songs.service';

@Component({
    selector: 'app-songs',
    templateUrl: './songs.component.html',
    styleUrls: ['./songs.component.less'],
    animations: [blend]
})
export class SongsComponent {

    constructor(
        public songsService: SongsService
    ) {
        songsService.loadSongList$().subscribe();
    }
}
