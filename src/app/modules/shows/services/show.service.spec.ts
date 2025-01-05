import {TestBed} from '@angular/core/testing';

import {ShowService} from './show.service';
import {ShowDataService} from './show-data.service';

describe('ShowService', () => {
  const mockShowDataService = {add: Promise.resolve(null)};
  beforeEach(
    () =>
      void TestBed.configureTestingModule({
        providers: [{provide: ShowDataService, useValue: mockShowDataService}],
      })
  );

  ShowService.SHOW_TYPE_PUBLIC.forEach(type => {
    it('should calc public flag for ' + type, async () => {
      const service: ShowService = TestBed.inject(ShowService);
      const addSpy = spyOn(TestBed.inject(ShowDataService), 'add').and.returnValue(Promise.resolve('id'));

      const id = await service.new$({showType: type});

      void expect(id).toBe('id');
      void expect(addSpy).toHaveBeenCalledWith({
        showType: type,
        public: true,
      });
    });
  });

  ShowService.SHOW_TYPE_PRIVATE.forEach(type => {
    it('should calc private flag for ' + type, async () => {
      const service: ShowService = TestBed.inject(ShowService);
      const addSpy = spyOn(TestBed.inject(ShowDataService), 'add').and.returnValue(Promise.resolve('id'));

      const id = await service.new$({showType: type});

      void expect(id).toBe('id');
      void expect(addSpy).toHaveBeenCalledWith({
        showType: type,
        public: false,
      });
    });
  });
});
