import {Directive, DestroyRef, Input, OnInit, TemplateRef, ViewContainerRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {UserService} from './user.service';

@Directive({selector: '[appOwner]'})
export class OwnerDirective implements OnInit {
  private templateRef = inject<TemplateRef<unknown>>(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);

  private currentUserId: string | null = null;
  private iAppOwner: string | null = null;

  @Input()
  public set appOwner(value: string) {
    this.iAppOwner = value;
    this.updateView();
  }

  public ngOnInit(): void {
    this.userService.userId$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(user => {
      this.currentUserId = user;
      this.updateView();
    });
    this.updateView();
  }

  private updateView(): void {
    this.viewContainer.clear();
    if (this.currentUserId === this.iAppOwner) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
