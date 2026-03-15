import {Injectable, inject} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {take} from 'rxjs/operators';
import {increment} from 'firebase/firestore';
import {DbService} from '../db.service';
import {ShowDataService} from '../../modules/shows/services/show-data.service';
import {ShowSongDataService} from '../../modules/shows/services/show-song-data.service';
import {UserSessionService} from './user-session.service';

export interface SongUsageMigrationResult {
  usersProcessed: number;
  showsProcessed: number;
  showSongsProcessed: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserSongUsageService {
  private db = inject(DbService);
  private session = inject(UserSessionService);
  private showDataService = inject(ShowDataService);
  private showSongDataService = inject(ShowSongDataService);

  public incSongCount = (songId: string) => this.updateSongUsage(songId, 1);
  public decSongCount = (songId: string) => this.updateSongUsage(songId, -1);

  public async rebuildSongUsage(): Promise<SongUsageMigrationResult> {
    const currentUser = await firstValueFrom(this.session.user$.pipe(take(1)));
    if (!currentUser || !this.hasAdminRole(currentUser.role)) {
      throw new Error('Admin role required to rebuild songUsage.');
    }

    const [users, shows] = await Promise.all([firstValueFrom(this.session.users$), firstValueFrom(this.showDataService.listRaw$())]);
    const songUsageByUserId: Record<string, Record<string, number>> = {};

    users.forEach(user => {
      songUsageByUserId[user.id] = {};
    });

    let showSongsProcessed = 0;
    for (const show of shows) {
      if (show.archived) {
        continue;
      }

      const ownerId = show.owner;
      if (!ownerId) {
        continue;
      }

      const showSongs = await firstValueFrom(this.showSongDataService.list$(show.id));
      const usage = songUsageByUserId[ownerId] ?? {};
      songUsageByUserId[ownerId] = usage;

      for (const showSong of showSongs) {
        showSongsProcessed += 1;
        usage[showSong.songId] = (usage[showSong.songId] ?? 0) + 1;
      }
    }

    await Promise.all(
      users.map(user =>
        this.session.update$(user.id, {
          songUsage: songUsageByUserId[user.id] ?? {},
        })
      )
    );

    return {
      usersProcessed: users.length,
      showsProcessed: shows.length,
      showSongsProcessed,
    };
  }

  private async updateSongUsage(songId: string, direction: number) {
    const user = await firstValueFrom(this.session.user$);
    if (!user) return null;

    await this.db.doc('users/' + user.id).update({
      [`songUsage.${songId}`]: increment(direction),
    });
  }

  private hasAdminRole(role: string | null | undefined): boolean {
    if (!role) {
      return false;
    }

    return role.split(';').includes('admin');
  }
}
