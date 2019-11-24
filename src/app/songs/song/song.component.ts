import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.less']
})
export class SongComponent implements OnInit {
  public songId: string;

  constructor(private activatedRoute: ActivatedRoute) {
  }

  public ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => this.songId = params.songId);
  }

}
