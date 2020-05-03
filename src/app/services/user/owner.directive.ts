import {Directive, ElementRef, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {UserService} from './user.service';

@Directive({
  selector: '[appOwner]'
})
export class OwnerDirective implements OnInit {
  private currentUserId: string;

  private _appOwner: string;

  @Input() set appOwner(value: string) {
    this._appOwner = value;
    this.updateView();
  }

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userService: UserService
  ) {

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
    if (this.currentUserId === this._appOwner) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

}
