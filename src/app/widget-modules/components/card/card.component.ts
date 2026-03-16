import {Component, Input} from '@angular/core';
import {faTimes} from '@fortawesome/free-solid-svg-icons';

import {MatIconButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {fade} from '../../../animations';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.less'],
  imports: [MatIconButton, RouterLink, FaIconComponent],
  animations: [fade],
})
export class CardComponent {
  @Input() public padding = true;
  @Input() public heading: string | null = null;
  @Input() public subheading: string | null = null;
  @Input() public closeLink: string | null = null;
  @Input() public closeIcon = faTimes;
  @Input() public fullscreen = false;
}
