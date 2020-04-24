import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.less']
})
export class FilterComponent {
  public value: string;

  constructor(private router: Router, activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(_ => {
      if (_.q) this.value = _.q;
    })
  }

  public async valueChange(text: string): Promise<void> {
    const route = text
      ? this.router.createUrlTree(['songs'], {queryParams: {q: text}})
      : this.router.createUrlTree(['songs']);

    await this.router.navigateByUrl(route);
  }
}
