import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.less'],
})
export class FilterComponent {
  public value: string;

  public constructor(private router: Router, activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe((_: {q: string}) => {
      if (_.q) {
        this.value = _.q;
      }
    });
  }

  public async valueChange(text: string): Promise<void> {
    const route = this.router.createUrlTree(['songs'], {
      queryParams: {q: text},
      queryParamsHandling: 'merge',
    });
    await this.router.navigateByUrl(route);
  }
}
