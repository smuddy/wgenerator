import {Component} from '@angular/core';
import {GuestShowDataService} from './guest-show-data.service';
import {ActivatedRoute} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {Song} from '../songs/services/song';
import {ConfigService} from '../../services/config.service';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.less'],
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
