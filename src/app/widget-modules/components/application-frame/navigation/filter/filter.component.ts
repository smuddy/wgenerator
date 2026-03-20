import {Component, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FilterStoreService} from '../../../../../services/filter-store.service';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

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
  private valueChanged$ = new Subject<string>();

  public value = '';

  public constructor() {
    const activatedRoute = inject(ActivatedRoute);

    activatedRoute.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: Params) => {
      const typedParams = params as {q: string};
      this.value = typedParams.q ?? '';
      this.filterStore.updateSongFilter({q: this.value});
    });

    this.valueChanged$.pipe(debounceTime(100), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe(text => void this.applyValueChange(text));
  }

  public valueChange(text: string): void {
    this.valueChanged$.next(text);
  }

  private async applyValueChange(text: string): Promise<void> {
    this.filterStore.updateSongFilter({q: text});
    const route = this.router.createUrlTree(['songs'], {
      queryParams: {q: text},
      queryParamsHandling: 'merge',
    });
    await this.router.navigateByUrl(route);
  }
}
