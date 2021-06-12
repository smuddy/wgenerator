import {Directive, ElementRef, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {UserService} from './user.service';

@Directive({
  selector: '[appOwner]',
})
export class OwnerDirective implements OnInit {
  private currentUserId: string | null = null;
  private iAppOwner: string | null = null;

  public constructor(private element: ElementRef, private templateRef: TemplateRef<unknown>, private viewContainer: ViewContainerRef, private userService: UserService) {}

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
