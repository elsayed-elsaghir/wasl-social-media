import { Directive, ElementRef, inject, input, type OnInit } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class Highlight {
  private el = inject(ElementRef);
  color = input('red');

  onMouseEnter() {
    this.el.nativeElement.style.backgroundColor = this.color();
  }
  onMouseLeave() {
    this.el.nativeElement.style.backgroundColor = '';
  }
}
