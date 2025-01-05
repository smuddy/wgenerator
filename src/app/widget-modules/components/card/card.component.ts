import {Component, Input} from '@angular/core';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {NgIf} from '@angular/common';
import {MatIconButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.less'],
  imports: [NgIf, MatIconButton, RouterLink, FaIconComponent],
})
export class CardComponent {
  @Input() public padding = true;
  @Input() public heading: string | null = null;
  @Input() public subheading: string | null = null;
  @Input() public closeLink: string | null = null;
  @Input() public closeIcon = faTimes;
  @Input() public fullscreen = false;
}
