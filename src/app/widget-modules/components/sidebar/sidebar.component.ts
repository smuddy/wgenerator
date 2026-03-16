import {Component} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faBars, faChevronLeft} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  imports: [MatIconButton, FaIconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.less',
  host: {
    '[class.collapsed]': 'collapsed',
  },
})
export class SidebarComponent {
  public collapsed = true;
  public openIcon = faChevronLeft;
  public closedIcon = faBars;

  public toggle(): void {
    this.collapsed = !this.collapsed;
  }
}
