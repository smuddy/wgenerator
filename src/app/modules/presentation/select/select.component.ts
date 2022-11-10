import {Component, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {ShowService} from '../../shows/services/show.service';
import {Show} from '../../shows/services/show';
import {GlobalSettingsService} from '../../../services/global-settings.service';
import {Router} from '@angular/router';
import {fade} from '../../../animations';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.less'],
  animations: [fade],
})
export class SelectComponent implements OnInit {
  public constructor(private showService: ShowService, private globalSettingsService: GlobalSettingsService, private router: Router) {}
  public visible = false;

  public shows$ = this.showService
    .list$(true)
    .pipe(map(_ => _.filter(_ => _.date.toDate() > new Date(new Date().setMonth(new Date().getMonth() - 1))).sort((a, b) => (b.date < a.date ? -1 : b.date > a.date ? 1 : 0))));

  public async selectShow(show: Show) {
    this.visible = false;
    await this.globalSettingsService.set({currentShow: show.id});
    await this.showService.update$(show.id, {presentationSongId: 'title'});
    await this.router.navigateByUrl('/presentation/remote');
  }

  public ngOnInit(): void {
    this.visible = true;
  }
}
