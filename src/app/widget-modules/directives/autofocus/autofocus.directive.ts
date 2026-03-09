import {Directive, ElementRef, Input, OnInit, inject} from '@angular/core';

@Directive({selector: '[appAutofocus]'})
export class AutofocusDirective implements OnInit {
  private focus = true;
  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  @Input()
  public set autofocus(condition: boolean) {
    this.focus = condition !== false;
  }

  public ngOnInit(): void {
    if (this.focus) {
      window.setTimeout(() => {
        this.el.nativeElement.focus();
      });
    }
  }
}
