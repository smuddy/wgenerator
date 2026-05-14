import {Component, input} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faBars, faChevronLeft} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-page-frame',
  imports: [MatIconButton, FaIconComponent],
  templateUrl: './page-frame.component.html',
  styleUrl: './page-frame.component.less',
  host: {
    '[class.collapsed]': 'collapsed',
  },
})
export class PageFrameComponent {
  public collapsed = true;
  public openIcon = faChevronLeft;
  public closedIcon = faBars;
  public title = input.required<string>();
  public withMenu = input<boolean>(true);
  public menuBadge = input<boolean>(false);

  public toggle(): void {
    this.collapsed = !this.collapsed;
  }

  public close(): void {
    this.collapsed = true;
  }
}
