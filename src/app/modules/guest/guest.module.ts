import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GuestComponent} from './guest.component';
import {RouterModule} from '@angular/router';
import {SWIPER_CONFIG, SwiperConfigInterface, SwiperModule} from 'ngx-swiper-wrapper';
import {SongTextModule} from '../../widget-modules/components/song-text/song-text.module';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  a11y: true,
  direction: 'horizontal',
  slidesPerView: 1,
  keyboard: true,
  mousewheel: true,
  scrollbar: false,
  navigation: true,
  pagination: false,

};

@NgModule({
  declarations: [GuestComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: GuestComponent}]),
    SwiperModule,
    SongTextModule
  ],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ]
})
export class GuestModule {
}
