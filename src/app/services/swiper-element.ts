let swiperRegistrationPromise: Promise<void> | null = null;

export function ensureSwiperElement(): Promise<void> {
  if (!swiperRegistrationPromise) {
    swiperRegistrationPromise = import('swiper/element/bundle').then(({register}) => {
      register();
    });
  }

  return swiperRegistrationPromise;
}
