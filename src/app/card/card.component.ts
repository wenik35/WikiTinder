import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChildren, QueryList } from '@angular/core';

import { Person } from '../api/person';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnDestroy {
  @Input() persons: Person[] = [];
  @Output() swiped = new EventEmitter<'left' | 'right'>();

  @ViewChildren('card', { read: ElementRef }) cardRefs!: QueryList<ElementRef<HTMLDivElement>>;

  private dragging = false;
  private startX = 0;
  private deltaX = 0;
  private pointerId: number | null = null;

  constructor(private renderer: Renderer2) {}

  private keyUnlisten: (() => void) | null = null;

  // Programmatic swipe triggers for buttons
  swipeRight() {
    this.programmaticSwipe('right');
  }

  swipeLeft() {
    this.programmaticSwipe('left');
  }

  private programmaticSwipe(direction: 'left' | 'right') {
    if (this.dragging) return; // avoid interrupting an active drag
    const cards = this.cardRefs.toArray();
    if (cards.length === 0) return;
    const elRef = cards[0];
    const el = elRef.nativeElement as HTMLElement;

    const offscreenX = (direction === 'right' ? 1 : -1) * window.innerWidth * 1.5;
    const rotate = direction === 'right' ? 20 : -20;

    this.renderer.setStyle(el, 'transition', 'transform 300ms ease-out, opacity 300ms');
    this.renderer.setStyle(el, 'transform', `translate3d(${offscreenX}px, 0, 0) rotate(${rotate}deg)`);
    this.renderer.setStyle(el, 'opacity', '0');

    setTimeout(() => {
      this.renderer.setStyle(el, 'visibility', 'hidden');
      this.renderer.setStyle(el, 'transition', 'none');
      this.renderer.setStyle(el, 'transform', 'translate3d(0, 0, 0)');
      this.renderer.setStyle(el, 'opacity', '1');
      this.swiped.emit(direction);
    }, 320);
  }

  ngOnInit(): void {
    // Listen on window for keyboard arrow presses
    this.keyUnlisten = this.renderer.listen('window', 'keydown', (ev: KeyboardEvent) => this.onKeydown(ev));
  }

  ngOnDestroy(): void {
    if (this.keyUnlisten) {
      this.keyUnlisten();
      this.keyUnlisten = null;
    }
  }

  private onKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null;
    if (target) {
      const tag = target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return;
    }

    if (event.key === 'ArrowLeft') {
      this.swipeLeft();
    } else if (event.key === 'ArrowRight') {
      this.swipeRight();
    }
  }

  onPointerDown(event: PointerEvent, index: number) {
    if (index !== 0) return; // only top card is interactive
    const elRef = this.cardRefs.toArray()[index];
    if (!elRef) return;
    this.dragging = true;
    this.startX = event.clientX;
    this.deltaX = 0;
    this.pointerId = event.pointerId;
    try { (elRef.nativeElement as HTMLElement).setPointerCapture(this.pointerId); } catch {}
    this.renderer.setStyle(elRef.nativeElement, 'transition', 'none');
  }

  onPointerMove(event: PointerEvent, index: number) {
    if (!this.dragging || index !== 0) return;
    this.deltaX = event.clientX - this.startX;
    const rotate = this.deltaX / 20; // subtle rotation
    const el = this.cardRefs.toArray()[index].nativeElement as HTMLElement;
    this.renderer.setStyle(el, 'transform', `translate3d(${this.deltaX}px, 0, 0) rotate(${rotate}deg)`);
  }

  onPointerUp(event: PointerEvent, index: number) {
    if (!this.dragging || index !== 0) return;
    this.dragging = false;
    const elRef = this.cardRefs.toArray()[index];
    if (!elRef) return;
    if (this.pointerId !== null) {
      try { elRef.nativeElement.releasePointerCapture(this.pointerId); } catch {}
      this.pointerId = null;
    }

    const threshold = window.innerWidth * 0.25; // 25% of viewport
    const absDelta = Math.abs(this.deltaX);

    if (absDelta >= threshold) {
      const direction: 'left' | 'right' = this.deltaX > 0 ? 'right' : 'left';
      // animate offscreen
      const offscreenX = (this.deltaX > 0 ? 1 : -1) * window.innerWidth * 1.5;
      this.renderer.setStyle(elRef.nativeElement, 'transition', 'transform 300ms ease-out, opacity 300ms');
      this.renderer.setStyle(elRef.nativeElement, 'transform', `translate3d(${offscreenX}px, 0, 0) rotate(${this.deltaX / 10}deg)`);
      this.renderer.setStyle(elRef.nativeElement, 'opacity', '0');

      // After animation: hide and emit (do not reset visibility — parent will remove the item)
      setTimeout(() => {
        this.renderer.setStyle(elRef.nativeElement, 'visibility', 'hidden');
        this.renderer.setStyle(elRef.nativeElement, 'transition', 'none');
        this.renderer.setStyle(elRef.nativeElement, 'transform', 'translate3d(0, 0, 0)');
        this.renderer.setStyle(elRef.nativeElement, 'opacity', '1');

        this.swiped.emit(direction);
      }, 320);
    } else {
      // snap back to original position
      this.renderer.setStyle(elRef.nativeElement, 'transition', 'transform 200ms ease-out');
      this.renderer.setStyle(elRef.nativeElement, 'transform', 'translate3d(0,0,0)');
      // clear transition after animation
      setTimeout(() => {
        this.renderer.setStyle(elRef.nativeElement, 'transition', 'none');
      }, 220);
    }
  }
}
