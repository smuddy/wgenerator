import {Component} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.less'],
})
export class FilterComponent {
  public value = '';

  public constructor(private router: Router, activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe((params: Params) => {
      const typedParams = params as {q: string};
      if (typedParams.q) this.value = typedParams.q;
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
