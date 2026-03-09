import {Directive, ElementRef, Input, OnInit, TemplateRef, ViewContainerRef, inject} from '@angular/core';
import {UserService} from './user.service';

@Directive({selector: '[appOwner]'})
export class OwnerDirective implements OnInit {
  private element = inject(ElementRef);
  private templateRef = inject<TemplateRef<unknown>>(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private userService = inject(UserService);

  private currentUserId: string | null = null;
  private iAppOwner: string | null = null;

  @Input()
  public set appOwner(value: string) {
    this.iAppOwner = value;
    this.updateView();
  }

  public ngOnInit(): void {
    this.userService.userId$.subscribe(user => {
      this.currentUserId = user;
      this.updateView();
    });
    this.updateView();
  }

  private updateView() {
    this.viewContainer.clear();
    if (this.currentUserId === this.iAppOwner) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
