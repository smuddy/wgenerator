import {Injectable} from '@angular/core';
import {SongDataService} from './song-data.service';
import {File} from './file';

@Injectable({
  providedIn: 'root'
})
export class FileDataService {

  constructor(private songDataService: SongDataService) {
  }

  public async put(songId: string, file: File): Promise<string> {
    const songRef = this.songDataService.getSongRef(songId);
    const fileCollection = songRef.collection('files');
    const id = await fileCollection.add(file);
    return id.id;
  }
}
