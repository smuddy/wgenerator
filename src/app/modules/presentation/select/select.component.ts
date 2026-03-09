import {Component, OnInit, inject} from '@angular/core';
import {map} from 'rxjs/operators';
import {ShowService} from '../../shows/services/show.service';
import {Show} from '../../shows/services/show';
import {GlobalSettingsService} from '../../../services/global-settings.service';
import {Router} from '@angular/router';
import {fade} from '../../../animations';
import {AsyncPipe, DatePipe} from '@angular/common';
import {CardComponent} from '../../../widget-modules/components/card/card.component';
import {MatButton} from '@angular/material/button';
import {UserNameComponent} from '../../../services/user/user-name/user-name.component';
import {ShowTypePipe} from '../../../widget-modules/pipes/show-type-translater/show-type.pipe';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.less'],
  animations: [fade],
  imports: [CardComponent, MatButton, UserNameComponent, AsyncPipe, DatePipe, ShowTypePipe],
})
export class SelectComponent implements OnInit {
  private showService = inject(ShowService);
  private globalSettingsService = inject(GlobalSettingsService);
  private router = inject(Router);

  public visible = false;
  public shows$ = this.showService
    .list$(true)
    .pipe(map(_ => _.filter(_ => _.date.toDate() > new Date(new Date().setMonth(new Date().getMonth() - 1))).sort((a, b) => (b.date < a.date ? -1 : b.date > a.date ? 1 : 0))));

  public async selectShow(show: Show) {
    this.visible = false;

    await this.globalSettingsService.set({currentShow: show.id});
    void this.showService.update$(show.id, {presentationSongId: 'title'});
    void this.router.navigateByUrl('/presentation/remote');
  }

  public ngOnInit(): void {
    this.visible = true;
  }
}
