import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
})
export class AutofocusDirective implements OnInit {
  private focus = true;

  public constructor(private el: ElementRef<HTMLElement>) {}

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
