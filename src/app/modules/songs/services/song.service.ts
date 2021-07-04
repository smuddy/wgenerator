import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Song} from './song';
import {SongDataService} from './song-data.service';
import {first} from 'rxjs/operators';
import {UserService} from '../../../services/user/user.service';
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

// declare let importCCLI: any;

@Injectable({
  providedIn: 'root',
})
export class SongService {
  public static TYPES = ['Praise', 'Worship'];
  public static STATUS = ['draft', 'set', 'final'];

  public static LEGAL_OWNER = ['CCLI', 'other'];
  public static LEGAL_TYPE = ['open', 'allowed'];

  // private list: Song[];

  public constructor(private songDataService: SongDataService, private userService: UserService) {
    // importCCLI = (songs: Song[]) => this.updateFromCLI(songs);
  }

  public list$ = (): Observable<Song[]> => this.songDataService.list$(); //.pipe(tap(_ => (this.list = _)));
  public read$ = (songId: string): Observable<Song | null> => this.songDataService.read$(songId);
  public read = (songId: string): Promise<Song | null> => this.read$(songId).pipe(first()).toPromise();

  public async update$(songId: string, data: Partial<Song>): Promise<void> {
    const song = await this.read(songId);
    if (!song) return;
    const edits = song.edits ?? [];
    const user = await this.userService.currentUser();
    if (!user) return;
    edits.push({username: user.name, timestamp: Timestamp.now()});
    await this.songDataService.update$(songId, {...data, edits});
  }

  public async new(songNumber: number, title: string): Promise<string> {
    return await this.songDataService.add({
      number: songNumber,
      title,
      status: 'draft',
      legalType: 'open',
    });
  }

  public async delete(songId: string): Promise<void> {
    await this.songDataService.delete(songId);
  }

  // https://www.csvjson.com/csv2json
  // private async updateFromCLI(songs: Song[]) {
  // 	const mapped = songs.map(_ => ({
  // 		number: _.number,
  // 		legalType: _.legalType === 'ja' ? 'allowed' : 'open',
  // 		legalOwner: _.legalOwner === 'ja' ? 'CCLI' : 'other',
  // 		title: _.title,
  // 		legalOwnerId: _.legalOwnerId,
  // 		origin: _.origin,
  // 		artist: _.artist,
  // 		comment: _.comment,
  // 	}));
  // 	const promises = this.list.map(async _ => {
  // 		// eslint-disable-next-line eqeqeq
  // 		const mappedSongs = mapped.filter(f => f.number == _.number);
  // 		if (mappedSongs.length === 1) {
  // 			const mappedSong = mappedSongs[0];
  // 			const id = _.id;
  // 			return await this.update$(id, mappedSong);
  // 		}
  // 	});
  //
  // 	await Promise.all(promises);
  // }
}
