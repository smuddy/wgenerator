import {Component, OnInit} from '@angular/core';
import {ShowDataService} from '../services/show-data.service';
import {Observable} from 'rxjs';
import {Show} from '../services/show';
import {ShowService} from '../services/show.service';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {faSave} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.less'],
})
export class NewComponent implements OnInit {
  public shows$: Observable<Show[]>;
  public showTypePublic = ShowService.SHOW_TYPE_PUBLIC;
  public showTypePrivate = ShowService.SHOW_TYPE_PRIVATE;
  public form: UntypedFormGroup = new UntypedFormGroup({
    date: new UntypedFormControl(null, Validators.required),
    showType: new UntypedFormControl(null, Validators.required),
  });
  public faSave = faSave;

  public constructor(
    private showService: ShowService,
    showDataService: ShowDataService,
    private router: Router
  ) {
    this.shows$ = showDataService.list$;
  }

  public ngOnInit(): void {
    this.form.reset();
  }

  public async onSave(): Promise<void> {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    const id = await this.showService.new$(this.form.value as Partial<Show>);
    await this.router.navigateByUrl(`/shows/${id ?? ''}`);
  }
}
