import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {GuestShowDataService} from './guest-show-data.service';
import {ActivatedRoute} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {Song} from '../songs/services/song';
import {ConfigService} from '../../services/config.service';
import {AsyncPipe, DatePipe} from '@angular/common';
import {SongTextComponent} from '../../widget-modules/components/song-text/song-text.component';
import {ShowTypePipe} from '../../widget-modules/pipes/show-type-translater/show-type.pipe';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.less'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [SongTextComponent, AsyncPipe, DatePipe, ShowTypePipe],
})
export class GuestComponent {
  public show$ = this.currentRoute.params.pipe(
    map(param => param.id as string),
    switchMap(id => this.service.read$(id))
  );
  public config$ = this.configService.get$();

  public constructor(
    private currentRoute: ActivatedRoute,
    private service: GuestShowDataService,
    private configService: ConfigService
  ) {}

  public trackBy = (index: number, show: Song) => show.id;
}
