import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ODataService} from 'odata-v4-ng';
import {ODataBaseService} from './ODataBaseService';
import {Song} from '../songs/models/song.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {State} from './state';
import {base} from './urls';
import {FileType} from '../songs/models/files-types.model';

@Injectable({
    providedIn: 'root'
})
export class SongsService extends ODataBaseService {
    public state = new BehaviorSubject<State>(State.list);

    public songs: BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([]);

    constructor(odataService: ODataService, private httpClient: HttpClient) {
        super(odataService, 'songs');
    }

    public loadSongList$(): Observable<Song[]> {
        const properties = ['ID', 'Name', 'Number', 'SongType', 'Key', 'Tempo'];
        const list = this.list$<Song>(properties).pipe(
            tap(_ => this.songs.next(_))
        );
        return list;
    }


    public patch$(id: number, control: string, value: any): Observable<boolean> {
        const patch = super.patch$(id, control, value).pipe(
            tap(() => {
                const songs = this.songs.value;
                const song = songs.filter(_ => _.ID === id)[0];
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
        const url = `${base}/api/songs/${songId}/files/${fileId}/edit?Name=${name}&FileType=${fileType}`;
        const get = this.httpClient.get(url);
        return get;
    }

    public deleteFile$(
        songId: number,
        fileId: number
    ): Observable<any> {
        const url = `${base}/api/songs/${songId}/files/${fileId}/delete`;
        const get = this.httpClient.get(url);
        return get;
    }
}
