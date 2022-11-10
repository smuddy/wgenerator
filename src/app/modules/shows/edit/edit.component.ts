import {Component, OnInit} from '@angular/core';
import {ShowDataService} from '../services/show-data.service';
import {Observable, take} from 'rxjs';
import {Show} from '../services/show';
import {ShowService} from '../services/show.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {faSave} from '@fortawesome/free-solid-svg-icons';
import {map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less'],
})
export class EditComponent implements OnInit {
  public shows$: Observable<Show[]>;
  public showTypePublic = ShowService.SHOW_TYPE_PUBLIC;
  public showTypePrivate = ShowService.SHOW_TYPE_PRIVATE;
  public form = new FormGroup({
    id: new FormControl<string | null>(null),
    date: new FormControl<Date | null>(null, Validators.required),
    showType: new FormControl<string | null>(null, Validators.required),
  });
  public faSave = faSave;

  public constructor(private showService: ShowService, showDataService: ShowDataService, private router: Router, private activatedRoute: ActivatedRoute) {
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

    await this.showService.update$(
      this.form.value.id as string,
      {
        date: this.form.value.date,
        showType: this.form.value.showType,
      } as Partial<Show>
    );
    await this.router.navigateByUrl(`/shows/${this.form.value.id ?? ''}`);
  }
}
