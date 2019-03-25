import { trigger, transition, style, animate } from '@angular/animations';

export const blend = trigger('blend', [
    transition(':enter', [
      style({ opacity: 0, display: 'none' }),
      animate('400ms', style({ opacity: 0 , display: 'none'})),
      animate('300ms', style({ opacity: 1, display: 'block' }))
    ]),
    transition(':leave', [
      style({ opacity: 1, display: 'block' }),
      animate('300ms', style({ opacity: 0, display: 'none' }))
    ])
  ]);
