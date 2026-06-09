import {Injectable, inject} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {take} from 'rxjs/operators';
import {UserSessionService} from '../../../services/user/user-session.service';
import {SongDataService} from './song-data.service';

export interface SongDownloadResult {
  fileName: string;
  songsDownloaded: number;
}

@Injectable({
  providedIn: 'root',
})
export class SongDownloadService {
  private session = inject(UserSessionService);
  private songDataService = inject(SongDataService);

  public async downloadSongs(): Promise<SongDownloadResult> {
    const currentUser = await firstValueFrom(this.session.user$.pipe(take(1)));
    if (!currentUser || !this.hasAdminRole(currentUser.role)) {
      throw new Error('Admin role required to download songs.');
    }

    const songs = await firstValueFrom(this.songDataService.listLoaded$());
    const sortedSongs = [...songs].sort((left, right) => {
      const numberCompare = (left.number ?? Number.MAX_SAFE_INTEGER) - (right.number ?? Number.MAX_SAFE_INTEGER);
      if (numberCompare !== 0) {
        return numberCompare;
      }

      return (left.title ?? '').localeCompare(right.title ?? '', 'de');
    });
    const fileName = `songs-${this.formatDate(new Date())}.json`;

    this.saveAs(new Blob([JSON.stringify(sortedSongs, null, 2)], {type: 'application/json'}), fileName);

    return {
      fileName,
      songsDownloaded: sortedSongs.length,
    };
  }

  private saveAs(blob: Blob, fileName: string) {
    const a = document.createElement('a');

    document.body.appendChild(a);
    a.setAttribute('target', '_self');
    a.style.display = 'none';

    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 1000);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private hasAdminRole(role: string | null | undefined): boolean {
    if (!role) {
      return false;
    }

    return role.split(';').includes('admin');
  }
}
