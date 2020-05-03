import {Directive, ElementRef, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {User} from './user';
import {UserService} from './user.service';

@Directive({
  selector: '[appOwner]'
})
export class OwnerDirective implements OnInit {
  @Input() appOwner: string;
  private currentUser: User;
  private loggedIn: boolean;

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userService: UserService
  ) {

  }

  public ngOnInit(): void {
    this.userService.user$.subscribe(user => {
      this.currentUser = user;
      this.updateView();
    });
    this.userService.loggedIn$().subscribe(_ => {
      this.loggedIn = !!_;
      this.updateView();
    });
    this.updateView();
  }

  private updateView() {
    this.viewContainer.clear();
    if (this.loggedIn && this.currentUser.id === this.appOwner) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }


}
