import {Injectable, inject} from '@angular/core';
import {SongDownloadResult, SongDownloadService} from '../../modules/songs/services/song-download.service';
import {MigrationProgress, ShowSongIndexMigrationResult, ShowSongIndexService} from '../../modules/shows/services/show-song-index.service';
import {SongUsageMigrationResult, UserSongUsageService} from '../user/user-song-usage.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private songDownload = inject(SongDownloadService);
  private songUsage = inject(UserSongUsageService);
  private showSongIndex = inject(ShowSongIndexService);

  public downloadSongs = (): Promise<SongDownloadResult> => this.songDownload.downloadSongs();
  public rebuildSongUsage = (): Promise<SongUsageMigrationResult> => this.songUsage.rebuildSongUsage();
  public rebuildShowSongIds = (onProgress?: (progress: MigrationProgress) => void): Promise<ShowSongIndexMigrationResult> => this.showSongIndex.rebuildShowSongIds(onProgress);
}
