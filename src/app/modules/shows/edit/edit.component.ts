import {Component, OnInit, inject} from '@angular/core';
import {ShowDataService} from '../services/show-data.service';
import {Observable, take} from 'rxjs';
import {Show} from '../services/show';
import {ShowService} from '../services/show.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {faSave} from '@fortawesome/free-solid-svg-icons';
import {map, switchMap} from 'rxjs/operators';
import {Timestamp} from '@angular/fire/firestore';
import {CardComponent} from '../../../widget-modules/components/card/card.component';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatSelect} from '@angular/material/select';
import {MatOptgroup, MatOption} from '@angular/material/core';

import {MatInput} from '@angular/material/input';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {ButtonRowComponent} from '../../../widget-modules/components/button-row/button-row.component';
import {ButtonComponent} from '../../../widget-modules/components/button/button.component';
import {ShowTypePipe} from '../../../widget-modules/pipes/show-type-translater/show-type.pipe';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less'],
  imports: [
    CardComponent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOptgroup,
    MatOption,
    MatInput,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    ButtonRowComponent,
    ButtonComponent,
    ShowTypePipe,
  ],
})
export class EditComponent implements OnInit {
  private showService = inject(ShowService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  public shows$: Observable<Show[]>;
  public showTypePublic = ShowService.SHOW_TYPE_PUBLIC;
  public showTypePrivate = ShowService.SHOW_TYPE_PRIVATE;
  public form = new FormGroup({
    id: new FormControl<string | null>(null),
    date: new FormControl<Date | null>(null, Validators.required),
    showType: new FormControl<string | null>(null, Validators.required),
  });
  public faSave = faSave;

  public constructor() {
    const showDataService = inject(ShowDataService);

    this.shows$ = showDataService.list$;
  }

  public ngOnInit(): void {
    this.form.reset();

    this.activatedRoute.params
      .pipe(
        map(param => param as {showId: string}),
        map(param => param.showId),
        switchMap((showId: string) => this.showService.read$(showId)),
        take(1)
      )
      .subscribe(show => {
        this.form.setValue({
          id: show?.id || null,
          date: show?.date.toDate() || null,
          showType: show?.showType || null,
        });
      });
  }

  public async onSave(): Promise<void> {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    const {id, date, showType} = this.form.getRawValue();
    if (!id || !date || !showType) {
      return;
    }

    await this.showService.update$(id, {
      date: Timestamp.fromDate(date),
      showType,
    } as Partial<Show>);
    await this.router.navigateByUrl(`/shows/${id}`);
  }
}
