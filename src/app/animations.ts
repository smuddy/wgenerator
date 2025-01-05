import {animate, query, state, style, transition, trigger} from '@angular/animations';

export const fade = [
  // the fade-in/fade-out animation.
  trigger('fade', [
    // the "in" style determines the "resting" state of the element when it is visible.
    state('in', style({opacity: 1, transform: 'translateY(0px)'})),

    // fade in when created. this could also be written as transition('void => *')
    transition(':enter', [style({opacity: 0, transform: 'translateY(-10px)'}), animate(200)]),
  ]),
];

export const fader = trigger('fader', [
  transition('* <=> *', [
    // Set a default  style for enter and leave
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          left: 0,
          width: '100%',
          opacity: 0,
          transform: 'scale(1) translateY(-10px)',
        }),
      ],
      {optional: true}
    ),
    // Animate the new page in
    query(
      ':enter',
      [
        animate(
          '300ms ease',
          style({
            opacity: 1,
            transform: 'scale(1) translateY(0)',
          })
        ),
      ],
      {optional: true}
    ),
  ]),
]);
