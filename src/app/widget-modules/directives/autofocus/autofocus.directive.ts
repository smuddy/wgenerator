import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[autofocus]'
})
export class AutofocusDirective {
  private focus = true;

  constructor(private el: ElementRef) {
  }

  @Input() set autofocus(condition: boolean) {
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
