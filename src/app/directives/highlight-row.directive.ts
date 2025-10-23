import { Directive, ElementRef, inject, input, effect } from '@angular/core';

@Directive({
  selector: '[appHighlightRow]',
  standalone: true
})
export class HighlightRowDirective {
  private readonly el = inject(ElementRef);
  private readonly highlightDuration = 2000; // 2 seconds
  private isFirstRun = true;
  
  triggerValue = input.required<any>({ alias: 'appHighlightRow' });
  
  constructor() {
    effect(() => {
      const value = this.triggerValue();
      
      // Skip the first run to avoid highlighting on initial render
      if (this.isFirstRun) {
        this.isFirstRun = false;
        return;
      }
      
      this.highlight();
    });
  }
  
  private highlight(): void {
    const element = this.el.nativeElement;
    
    // Add highlight class
    element.classList.add('row-highlight');
    
    // Remove after duration
    setTimeout(() => {
      element.classList.remove('row-highlight');
    }, this.highlightDuration);
  }
}

