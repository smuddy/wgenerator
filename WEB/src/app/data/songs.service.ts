import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ODataService} from 'odata-v4-ng';
import {ODataBaseService} from './ODataBaseService';
import {Song} from '../songs/models/song.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {State} from './state';
import {FileType} from '../songs/models/files-types.model';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SongsService extends ODataBaseService {
    public state = new BehaviorSubject<State>(State.list);

    public songs = new BehaviorSubject<{ count: number, data: Song[] }>({count: 0, data: []});

    constructor(odataService: ODataService, private httpClient: HttpClient) {
        super(odataService, 'songs');
    }

    public loadSongList$(page: number, pageSize: number): Observable<{ count: number, data: Song[] }> {
        const properties = ['ID', 'Name', 'Number', 'SongType', 'Key', 'Tempo'];
        const list = this.list$<Song>(properties, page * pageSize, pageSize).pipe(
            tap(_ => this.songs.next(_))
        );
        return list;
    }

    public patch$(id: number, control: string, value: any): Observable<boolean> {
        const patch = super.patch$(id, control, value).pipe(
            tap(() => {
                const songs = this.songs.value;
                const song = songs.data.filter(_ => _.ID === id)[0];
                song[control] = value;
                this.songs.next(songs);
            })
        );

        return patch;
    }

    public saveNewSong$(values: any): Observable<Song> {
        const newSong = super.post$<Song>(values);

        return newSong;
    }

    public updateFile$(
        songId: number,
        fileId: number,
        name: string,
        fileType: FileType
    ): Observable<any> {
        const url = `${environment.api}/api/songs/${songId}/files/${fileId}/edit?Name=${name}&FileType=${fileType}`;
        const get = this.httpClient.get(url);
        return get;
    }

    public deleteFile$(
        songId: number,
        fileId: number
    ): Observable<any> {
        const url = `${environment.api}/api/songs/${songId}/files/${fileId}/delete`;
        const get = this.httpClient.get(url);
        return get;
    }
}
