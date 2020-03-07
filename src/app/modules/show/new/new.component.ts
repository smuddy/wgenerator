import {Component, OnInit} from '@angular/core';
import {ShowDataService} from '../services/show-data.service';
import {Observable} from 'rxjs';
import {Show} from '../services/show';
import {ShowService} from '../services/show.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.less']
})
export class NewComponent implements OnInit {
  public shows$: Observable<Show[]>;
  public showType = this.showService.SHOW_TYPE;
  public form: FormGroup;
  public publicChosen = false;

  constructor(private showService: ShowService, showDataService: ShowDataService, private router: Router) {
    this.shows$ = showDataService.list$();
  }

  public ngOnInit(): void {
    this.form = new FormGroup({
      public: new FormControl(null),
      date: new FormControl(null, Validators.required),
      showType: new FormControl(null, Validators.required),
    })
  }

  public onIsPublic(isPublic: boolean): void {
    this.form.patchValue({public: isPublic});
    this.publicChosen = true;
  }

  public async onSave() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;

    const id = await this.showService.new(this.form.value);
    await this.router.navigateByUrl('/show/' + id);
  }
}
