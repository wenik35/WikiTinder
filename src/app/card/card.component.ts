import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() imageSrc = '';
  @Input() alt = '';
  @Input() backImageSrc = '';
  @Output() swiped = new EventEmitter<'left' | 'right'>();

  @ViewChild('card', { static: true }) cardRef!: ElementRef<HTMLDivElement>;

  private dragging = false;
  private startX = 0;
  private deltaX = 0;
  private pointerId: number | null = null;

  constructor(private renderer: Renderer2) {}

  onPointerDown(event: PointerEvent) {
    if (!this.cardRef) return;
    this.dragging = true;
    this.startX = event.clientX;
    this.deltaX = 0;
    this.pointerId = event.pointerId;
    (this.cardRef.nativeElement as HTMLElement).setPointerCapture(this.pointerId);
    this.renderer.setStyle(this.cardRef.nativeElement, 'transition', 'none');
  }

  onPointerMove(event: PointerEvent) {
    if (!this.dragging) return;
    this.deltaX = event.clientX - this.startX;
    const rotate = this.deltaX / 20; // subtle rotation
    this.renderer.setStyle(
      this.cardRef.nativeElement,
      'transform',
      `translate3d(${this.deltaX}px, 0, 0) rotate(${rotate}deg)`
    );
  }

  onPointerUp(event: PointerEvent) {
    if (!this.dragging || !this.cardRef) return;
    this.dragging = false;
    if (this.pointerId !== null) {
      try { this.cardRef.nativeElement.releasePointerCapture(this.pointerId); } catch {}
      this.pointerId = null;
    }

    const threshold = window.innerWidth * 0.25; // 25% of viewport
    const absDelta = Math.abs(this.deltaX);

    if (absDelta >= threshold) {
      const direction: 'left' | 'right' = this.deltaX > 0 ? 'right' : 'left';
      // animate offscreen
      const offscreenX = (this.deltaX > 0 ? 1 : -1) * window.innerWidth * 1.5;
      this.renderer.setStyle(this.cardRef.nativeElement, 'transition', 'transform 300ms ease-out, opacity 300ms');
      this.renderer.setStyle(this.cardRef.nativeElement, 'transform', `translate3d(${offscreenX}px, 0, 0) rotate(${this.deltaX / 10}deg)`);
      this.renderer.setStyle(this.cardRef.nativeElement, 'opacity', '0');

      // After animation: hide, reset position, make visible again and emit
      setTimeout(() => {
        this.renderer.setStyle(this.cardRef.nativeElement, 'visibility', 'hidden');
        this.renderer.setStyle(this.cardRef.nativeElement, 'transition', 'none');
        this.renderer.setStyle(this.cardRef.nativeElement, 'transform', 'translate3d(0, 0, 0)');
        this.renderer.setStyle(this.cardRef.nativeElement, 'opacity', '1');

        // small timeout to ensure styles applied then show again
        setTimeout(() => {
          this.renderer.setStyle(this.cardRef.nativeElement, 'visibility', 'visible');
        }, 20);

        this.swiped.emit(direction);
      }, 320);
    } else {
      // snap back to original position
      this.renderer.setStyle(this.cardRef.nativeElement, 'transition', 'transform 200ms ease-out');
      this.renderer.setStyle(this.cardRef.nativeElement, 'transform', 'translate3d(0,0,0)');
      // clear transition after animation
      setTimeout(() => {
        this.renderer.setStyle(this.cardRef.nativeElement, 'transition', 'none');
      }, 220);
    }
  }
}
