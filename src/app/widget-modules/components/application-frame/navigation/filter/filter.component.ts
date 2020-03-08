import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.less']
})
export class FilterComponent {

  constructor(private router: Router) {
  }

  public async onInputChange(text: string): Promise<void> {
    const route = text
      ? this.router.createUrlTree(['songs'], {queryParams: {q: text}})
      : this.router.createUrlTree(['songs']);

    await this.router.navigateByUrl(route);
  }
}
