import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  inject,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'ui-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class Dialog implements AfterViewInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly previouslyFocused = document.activeElement as HTMLElement | null;

  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly closeLabel = input.required<string>();
  readonly closeRequested = output<void>();

  ngAfterViewInit(): void {
    const preferred = this.host.nativeElement.querySelector<HTMLElement>(
      '[data-dialog-initial-focus]',
    );
    (preferred ?? this.focusableElements()[0])?.focus();
  }

  ngOnDestroy(): void {
    this.previouslyFocused?.focus();
  }

  @HostListener('document:keydown', ['$event'])
  protected handleKeyboard(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeRequested.emit();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = this.focusableElements();
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  protected closeFromBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.closeRequested.emit();
  }

  private focusableElements(): readonly HTMLElement[] {
    return Array.from(
      this.host.nativeElement.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
  }
}
