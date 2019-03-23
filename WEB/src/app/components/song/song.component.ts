import { DownloadService } from './../../data/download.service';
import { Component, OnInit } from '@angular/core';
import { SongDetailModel } from 'src/app/models/song-list-detail.model';
import { ActivatedRoute } from '@angular/router';
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.less']
})
export class SongComponent implements OnInit {
  public song: SongDetailModel;
  public faArrow = faLongArrowAltLeft;

  constructor(
    private route: ActivatedRoute,
    private downloadService: DownloadService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data: { song: SongDetailModel }) => {
      this.song = data.song;
    });
  }

  public onClickDownload(): void {
    const id = this.song.Id;
    const withKey = this.song.HasKeyFile;
    this.downloadService.get(id, withKey);
  }
}
