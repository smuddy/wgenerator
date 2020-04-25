import {Directive, ElementRef, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {roles} from './roles';
import {UserService} from './user.service';
import {User} from './user';

@Directive({
  selector: '[appRole]'
})
export class RoleDirective implements OnInit {
  @Input() appRole: roles[] = [];
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
    if (this.loggedIn && this.checkPermission()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private checkPermission() {
    if (this.currentUser && this.currentUser.role) {
      if (this.currentUser.role === 'admin') return true;
      for (const role of this.appRole) {
        if (this.currentUser.role.indexOf(role) !== -1) return true;
      }
    }

    return false;
  }


}
