"use client";

import { cn } from "@/lib/utils";

// Native <input type="range"> slider — drop-in replacement for the Radix slider.
// Uses browser-native pointer capture so drag is never interrupted by competing
// event handlers (e.g. react-easy-crop inside a dialog).
//
// Supports both single-value  value={[n]}         and
//             range            value={[lo, hi]}    modes.

type SliderProps = {
  value: number[];
  onValueChange: (values: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
};

// Thumb styles shared across single and range modes.
// No track-height overrides here — we let the input's own height serve as
// the track reference so webkit positions the thumb center automatically.
const THUMB_CLASSES =
  "[&::-webkit-slider-thumb]:appearance-none " +
  "[&::-webkit-slider-thumb]:size-4 " +
  "[&::-webkit-slider-thumb]:rounded-full " +
  "[&::-webkit-slider-thumb]:bg-white " +
  "[&::-webkit-slider-thumb]:border-2 " +
  "[&::-webkit-slider-thumb]:border-primary " +
  "[&::-webkit-slider-thumb]:shadow-sm " +
  "[&::-webkit-slider-thumb]:cursor-pointer " +
  "[&::-webkit-slider-thumb]:transition-[box-shadow] " +
  "[&::-webkit-slider-runnable-track]:bg-transparent " +
  "[&::-moz-range-thumb]:size-4 " +
  "[&::-moz-range-thumb]:rounded-full " +
  "[&::-moz-range-thumb]:bg-white " +
  "[&::-moz-range-thumb]:border-solid " +
  "[&::-moz-range-thumb]:border-2 " +
  "[&::-moz-range-thumb]:border-primary " +
  "[&::-moz-range-thumb]:shadow-sm " +
  "[&::-moz-range-thumb]:cursor-pointer " +
  "[&::-moz-range-track]:bg-transparent";

export function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  className,
}: SliderProps) {
  const isRange = value.length >= 2;
  const lower = value[0];
  const upper = isRange ? value[1] : value[0];

  const lowerPct = ((lower - min) / (max - min)) * 100;
  const upperPct = ((upper - min) / (max - min)) * 100;

  // ─── Single value ─────────────────────────────────────────────────────────

  if (!isRange) {
    return (
      <div className={cn("relative flex w-full items-center", className)}>
        {/* Muted track background */}
        <div className="pointer-events-none absolute w-full top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-muted">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${upperPct}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={lower}
          onChange={(e) => onValueChange([Number(e.target.value)])}
          disabled={disabled}
          className={cn(
            // h-1.5 matches the visual track height — webkit centers the
            // thumb on the input height automatically, no extra CSS needed
            "relative w-full h-1.5 appearance-none bg-transparent cursor-pointer",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            THUMB_CLASSES,
          )}
        />
      </div>
    );
  }

  // ─── Range (two thumbs) ───────────────────────────────────────────────────

  function handleLower(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Math.min(Number(e.target.value), upper - step);
    onValueChange([v, upper]);
  }

  function handleUpper(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Math.max(Number(e.target.value), lower + step);
    onValueChange([lower, v]);
  }

  // Strategy: both inputs are the same h-1.5 height, centered on the track
  // line via top-1/2 + -translate-y-1/2. pointer-events:none keeps the track
  // area non-interactive; only the thumb pseudo-element gets pointer events.
  // The container (h-5) provides extra vertical hit area for the thumb.
  const rangeInputClass = cn(
    "absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5",
    "appearance-none bg-transparent cursor-pointer",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "[&::-webkit-slider-thumb]:pointer-events-auto",
    "[&::-moz-range-thumb]:pointer-events-auto",
    THUMB_CLASSES,
  );

  // Flip z-index when lower thumb reaches the upper limit so both remain
  // accessible when stacked at the same position.
  const lowerOnTop = lower >= max - step;

  return (
    <div className={cn("relative w-full h-5", className)}>
      {/* Muted track background + active fill */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-muted">
        <div
          className="absolute h-full bg-primary rounded-full"
          style={{ left: `${lowerPct}%`, width: `${upperPct - lowerPct}%` }}
        />
      </div>

      {/* Lower thumb */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={lower}
        onChange={handleLower}
        disabled={disabled}
        style={{ pointerEvents: "none" }}
        className={cn(rangeInputClass, lowerOnTop ? "z-[3]" : "z-[1]")}
      />

      {/* Upper thumb */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={upper}
        onChange={handleUpper}
        disabled={disabled}
        style={{ pointerEvents: "none" }}
        className={cn(rangeInputClass, lowerOnTop ? "z-[1]" : "z-[3]")}
      />
    </div>
  );
}
