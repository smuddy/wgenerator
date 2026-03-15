import {Injectable, inject} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {take} from 'rxjs/operators';
import {ShowDataService} from './show-data.service';
import {ShowSongDataService} from './show-song-data.service';
import {UserSessionService} from '../../../services/user/user-session.service';

export interface ShowSongIndexMigrationResult {
  showsProcessed: number;
  showSongsProcessed: number;
}

export interface MigrationProgress {
  processed: number;
  total: number;
  showId: string;
  showSongsProcessed: number;
}

@Injectable({
  providedIn: 'root',
})
export class ShowSongIndexService {
  private session = inject(UserSessionService);
  private showDataService = inject(ShowDataService);
  private showSongDataService = inject(ShowSongDataService);

  public async rebuildShowSongIds(onProgress?: (progress: MigrationProgress) => void): Promise<ShowSongIndexMigrationResult> {
    const currentUser = await firstValueFrom(this.session.user$.pipe(take(1)));
    if (!currentUser || !this.hasAdminRole(currentUser.role)) {
      throw new Error('Admin role required to rebuild show song ids.');
    }

    const shows = await firstValueFrom(this.showDataService.listRaw$());
    let showSongsProcessed = 0;
    let processed = 0;

    for (const show of shows) {
      const showSongs = await firstValueFrom(this.showSongDataService.list$(show.id));
      const songIds = [...new Set(showSongs.map(showSong => showSong.songId).filter(Boolean))];
      showSongsProcessed += showSongs.length;
      await this.showDataService.update(show.id, {songIds});
      processed += 1;
      onProgress?.({
        processed,
        total: shows.length,
        showId: show.id,
        showSongsProcessed,
      });
    }

    return {
      showsProcessed: shows.length,
      showSongsProcessed,
    };
  }

  private hasAdminRole(role: string | null | undefined): boolean {
    if (!role) {
      return false;
    }

    return role.split(';').includes('admin');
  }
}
