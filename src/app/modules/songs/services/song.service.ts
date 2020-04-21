import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Song} from './song';
import {SongDataService} from './song-data.service';
import {tap} from 'rxjs/operators';

declare var importCCLI: any;

@Injectable({
  providedIn: 'root'
})
export class SongService {

  public static TYPES = ['Praise', 'Worship'];

  public static LEGAL_OWNER = ['CCLI', 'other'];
  public static LEGAL_TYPE = ['open', 'allowed'];


  private list: Song[];

  constructor(private songDataService: SongDataService) {
    importCCLI = (songs: Song[]) => this.updateFromCLI(songs);
  }

  public list$ = (): Observable<Song[]> => this.songDataService.list$().pipe(tap(_ => this.list = _));
  public read = (songId: string): Observable<Song | undefined> => this.songDataService.read$(songId);

  public async update$(songId: string, data: Partial<Song>): Promise<void> {
    await this.songDataService.update$(songId, data);
  }

// https://www.csvjson.com/csv2json
  private async updateFromCLI(songs: Song[]) {
    const mapped = songs.map(_ => ({
      number: _.number,
      legalType: _.legalType === 'ja' ? 'allowed' : 'open',
      legalOwner: _.legalOwner === 'ja' ? 'CCLI' : 'other',
      title: _.title,
      legalOwnerId: _.legalOwnerId,
      origin: _.origin,
      artist: _.artist,
      comment: _.comment
    }));
    const promises = this.list.map(async _ => {
      // tslint:disable-next-line:triple-equals
      const mappedSongs = mapped.filter(f => f.number == _.number);
      if (mappedSongs.length === 1) {
        const mappedSong = mappedSongs[0];
        const id = _.id;
        return await this.update$(id, mappedSong);
      }
    });

    await Promise.all(promises);
  }


}