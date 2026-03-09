import {Component, OnInit} from '@angular/core';
import {ShowDataService} from '../services/show-data.service';
import {Observable} from 'rxjs';
import {Show} from '../services/show';
import {ShowService} from '../services/show.service';
import {ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {faSave} from '@fortawesome/free-solid-svg-icons';
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
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.less'],
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
