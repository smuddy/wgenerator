import {ChangeDetectorRef, Directive, ElementRef, Input, OnInit, TemplateRef, ViewContainerRef, inject} from '@angular/core';
import {roles} from './roles';
import {UserService} from './user.service';
import {User} from './user';
import {combineLatest} from 'rxjs';

@Directive({selector: '[appRole]'})
export class RoleDirective implements OnInit {
  private element = inject(ElementRef);
  private templateRef = inject<TemplateRef<unknown>>(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private userService = inject(UserService);
  private changeDetection = inject(ChangeDetectorRef);

  @Input() public appRole: roles[] = [];
  private currentUser: User | null = null;
  private loggedIn = false;
  private currentViewState = false;

  public ngOnInit(): void {
    combineLatest([this.userService.user$, this.userService.loggedIn$()]).subscribe(_ => {
      this.currentUser = _[0];
      this.loggedIn = _[1];
      this.updateView();
    });
  }

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
