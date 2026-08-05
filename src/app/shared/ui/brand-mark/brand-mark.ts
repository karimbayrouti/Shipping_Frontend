import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Natural pixel size of the official logo asset (the file is never modified). */
const SOURCE = { w: 2000, h: 1333 } as const;

/**
 * Measured mark bounds inside the asset (from the prototype's BRAND_CROP):
 * `full` frames the word-mark, `compact` frames just the "R" road glyph for
 * rails too narrow for the full word-mark.
 */
const CROP = {
  full: { x: 684, y: 506, w: 630, h: 302 },
  compact: { x: 688, y: 510, w: 244, h: 246 },
} as const;

/**
 * BrandMark — the single reusable branding component for the whole system:
 * portal headers and sidebars, the login screen and printed documents all
 * render this. It shows the official logo asset as-is, framing the mark via a
 * CSS crop (ported 1:1 from the prototype's BrandMark in App.tsx).
 */
@Component({
  selector: 'ui-brand-mark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './brand-mark.html',
  styleUrl: './brand-mark.scss',
})
export class BrandMark {
  /** Rendered height in px; width follows the crop's aspect ratio. */
  readonly height = input(34);
  readonly compact = input(false);

  private readonly crop = computed(() => (this.compact() ? CROP.compact : CROP.full));
  private readonly scale = computed(() => this.height() / this.crop().h);

  protected readonly frameWidth = computed(() => Math.round(this.crop().w * this.scale()));
  protected readonly radius = computed(() => Math.min(8, this.height() * 0.18));
  protected readonly imgWidth = computed(() => SOURCE.w * this.scale());
  protected readonly imgHeight = computed(() => SOURCE.h * this.scale());
  protected readonly offsetX = computed(() => -(this.crop().x * this.scale()));
  protected readonly offsetY = computed(() => -(this.crop().y * this.scale()));
}
