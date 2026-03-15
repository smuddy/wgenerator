import {ChangeDetectorRef, DestroyRef, Directive, Input, OnInit, TemplateRef, ViewContainerRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {roles} from './roles';
import {UserService} from './user.service';
import {User} from './user';
import {combineLatest} from 'rxjs';

@Directive({selector: '[appRole]'})
export class RoleDirective implements OnInit {
  private templateRef = inject<TemplateRef<unknown>>(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private userService = inject(UserService);
  private changeDetection = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  @Input() public appRole: roles[] = [];
  private currentUser: User | null = null;
  private loggedIn = false;
  private currentViewState = false;

  public ngOnInit(): void {
    combineLatest([this.userService.user$, this.userService.loggedIn$()])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([user, loggedIn]) => {
        this.currentUser = user;
        this.loggedIn = loggedIn;
        this.updateView();
      });
  }

  private updateView(): void {
    const viewState = this.loggedIn && this.checkPermission();
    if (this.currentViewState !== viewState) {
      if (!viewState) this.viewContainer.clear();
      if (viewState) this.viewContainer.createEmbeddedView(this.templateRef);
      this.changeDetection.markForCheck();
      this.currentViewState = viewState;
    }
  }

  private checkPermission(): boolean {
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
