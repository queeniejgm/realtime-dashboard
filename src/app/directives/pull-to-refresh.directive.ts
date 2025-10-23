import { Directive, ElementRef, EventEmitter, Output, inject, HostListener } from '@angular/core';

@Directive({
  selector: '[appPullToRefresh]',
  standalone: true
})
export class PullToRefreshDirective {
  private readonly el = inject(ElementRef<HTMLElement>);

  @Output() refresh = new EventEmitter<void>();

  private startY: number | null = null;
  private pulling = false;
  private threshold = 60; // px

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    const target = this.el.nativeElement;
    if (target.scrollTop === 0) {
      this.startY = event.touches[0].clientY;
      this.pulling = true;
    } else {
      this.startY = null;
      this.pulling = false;
    }
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (!this.pulling || this.startY === null) return;
    const currentY = event.touches[0].clientY;
    const delta = currentY - this.startY;
    if (delta > this.threshold) {
      // Trigger and stop tracking to avoid multiple emits until next gesture
      this.pulling = false;
      this.startY = null;
      this.refresh.emit();
    }
  }

  @HostListener('touchend')
  onTouchEnd(): void {
    this.pulling = false;
    this.startY = null;
  }
}


