import {ChangeDetectorRef, Directive, ElementRef, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {roles} from './roles';
import {UserService} from './user.service';
import {User} from './user';
import {combineLatest} from 'rxjs';

@Directive({
  selector: '[appRole]',
})
export class RoleDirective implements OnInit {
  @Input() public appRole: roles[] = [];
  private currentUser: User | null = null;
  private loggedIn = false;

  public constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private userService: UserService,
    private changeDetection: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    combineLatest([this.userService.user$, this.userService.loggedIn$()]).subscribe(_ => {
      this.currentUser = _[0];
      this.loggedIn = _[1];
      this.updateView();
    });
  }

  private currentViewState = false;
  private updateView() {
    const viewState = this.loggedIn && this.checkPermission();
    if (this.currentViewState !== viewState) {
      if (!viewState) this.viewContainer.clear();
      if (viewState) this.viewContainer.createEmbeddedView(this.templateRef);
      this.changeDetection.markForCheck();
      this.currentViewState = viewState;
    }
  }

  private checkPermission() {
    if (this.currentUser && this.currentUser.role) {
      if (this.currentUser.role === 'admin') {
        return true;
      }
      for (const role of this.appRole) {
        if (this.currentUser.role.indexOf(role) !== -1) {
          return true;
        }
      }
    }

    return false;
  }
}
