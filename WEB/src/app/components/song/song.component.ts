import { DownloadService } from './../../data/download.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';
import { Song } from 'src/app/models/song.model';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.less']
})
export class SongComponent implements OnInit {
  public song: Song;
  public faArrow = faLongArrowAltLeft;

  constructor(
    private route: ActivatedRoute,
    private downloadService: DownloadService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data: { song: Song }) => {
      this.song = data.song;
    });
  }

  public onClickDownload(): void {
    const id = this.song.ID;
    this.downloadService.get(id, false);
  }
}
