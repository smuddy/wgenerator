import {Component, CUSTOM_ELEMENTS_SCHEMA, inject} from '@angular/core';
import {AsyncPipe, DatePipe} from '@angular/common';
import {GuestShowDataService} from './guest-show-data.service';
import {ActivatedRoute} from '@angular/router';
import {catchError, map, switchMap} from 'rxjs/operators';
import {Song} from '../songs/services/song';
import {SongTextComponent} from '../../widget-modules/components/song-text/song-text.component';
import {ShowTypePipe} from '../../widget-modules/pipes/show-type-translater/show-type.pipe';
import {concat, from, Observable, of} from 'rxjs';
import {GuestShow} from './guest-show';
import {ensureSwiperElement} from '../../services/swiper-element';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.less'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [SongTextComponent, AsyncPipe, DatePipe, ShowTypePipe],
})
export class GuestComponent {
  private currentRoute = inject(ActivatedRoute);
  private service = inject(GuestShowDataService);

  public constructor() {
    void ensureSwiperElement();
  }

  public showState$: Observable<GuestShowState> = this.currentRoute.params.pipe(
    map(param => param.id as string),
    switchMap(id =>
      concat(
        of<GuestShowState>({status: 'loading'}),
        from(this.service.read(id)).pipe(
          switchMap(show => {
            const normalizedShow = this.normalizeShow(show);

            if (!normalizedShow) {
              return of<GuestShowState>({status: 'not-found'});
            }

            return concat(
              of<GuestShowState>({status: 'loaded', show: normalizedShow}),
              this.service.read$(id).pipe(
                map(liveShow => this.normalizeShow(liveShow)),
                map(liveShow => (liveShow ? ({status: 'loaded', show: liveShow} as GuestShowState) : ({status: 'not-found'} as GuestShowState))),
                catchError(() => of<GuestShowState>({status: 'error', message: 'Live-Aktualisierung fehlgeschlagen.'}))
              )
            );
          }),
          catchError(() => of<GuestShowState>({status: 'error', message: 'Gastansicht konnte nicht geladen werden.'}))
        )
      )
    )
  );

  public trackBy = (index: number, show: Song) => show.id;

  private normalizeShow(show: GuestShow | null): GuestShowView | null {
    if (!show) {
      return null;
    }

    return {
      ...show,
      date: this.toDate(show.date),
      updatedAt: this.toDate(show.updatedAt ?? null),
      songs: Array.isArray(show.songs) ? show.songs : [],
    };
  }

  private toDate(value: unknown): Date | null {
    if (value instanceof Date) {
      return value;
    }

    if (typeof value === 'object' && value !== null) {
      if ('toDate' in value && typeof value.toDate === 'function') {
        return value.toDate() as Date;
      }

      if ('seconds' in value && typeof value.seconds === 'number') {
        return new Date(value.seconds * 1000);
      }
    }

    if (typeof value === 'string' || typeof value === 'number') {
      const parsedDate = new Date(value);
      return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    return null;
  }
}

interface GuestShowView extends Omit<GuestShow, 'date' | 'updatedAt'> {
  date: Date | null;
  updatedAt: Date | null;
}

type GuestShowState =
  | {status: 'loading'}
  | {status: 'not-found'}
  | {status: 'error'; message: string}
  | {status: 'loaded'; show: GuestShowView};
