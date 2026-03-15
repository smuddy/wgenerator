import {Component, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FilterStoreService} from '../../../../../services/filter-store.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.less'],
  imports: [ReactiveFormsModule, FormsModule],
})
export class FilterComponent {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private filterStore = inject(FilterStoreService);

  public value = '';

  public constructor() {
    const activatedRoute = inject(ActivatedRoute);

    activatedRoute.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: Params) => {
      const typedParams = params as {q: string};
      this.value = typedParams.q ?? '';
      this.filterStore.updateSongFilter({q: this.value});
    });
  }

  public async valueChange(text: string): Promise<void> {
    this.filterStore.updateSongFilter({q: text});
    const route = this.router.createUrlTree(['songs'], {
      queryParams: {q: text},
      queryParamsHandling: 'merge',
    });
    await this.router.navigateByUrl(route);
  }
}
