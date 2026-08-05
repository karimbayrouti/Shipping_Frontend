import { ElementRef, afterNextRender, inject } from '@angular/core';

export function renderDialogToBody(): void {
  const host = inject(ElementRef).nativeElement as HTMLElement;
  afterNextRender(() => {
    document.body.appendChild(host);
  });
}
