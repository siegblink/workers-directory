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

// Shared Tailwind classes for the native thumb across both modes.
const THUMB =
  // webkit
  "[&::-webkit-slider-thumb]:appearance-none " +
  "[&::-webkit-slider-thumb]:size-4 " +
  "[&::-webkit-slider-thumb]:rounded-full " +
  "[&::-webkit-slider-thumb]:bg-white " +
  "[&::-webkit-slider-thumb]:border-2 " +
  "[&::-webkit-slider-thumb]:border-primary " +
  "[&::-webkit-slider-thumb]:shadow-sm " +
  "[&::-webkit-slider-thumb]:cursor-pointer " +
  "[&::-webkit-slider-thumb]:transition-[box-shadow] " +
  "[&::-webkit-slider-thumb]:hover:ring-4 " +
  "[&::-webkit-slider-thumb]:hover:ring-ring/50 " +
  // hide the native webkit track (we draw our own)
  "[&::-webkit-slider-runnable-track]:bg-transparent " +
  "[&::-webkit-slider-runnable-track]:h-0 " +
  // firefox
  "[&::-moz-range-thumb]:size-4 " +
  "[&::-moz-range-thumb]:rounded-full " +
  "[&::-moz-range-thumb]:bg-white " +
  "[&::-moz-range-thumb]:border-solid " +
  "[&::-moz-range-thumb]:border-2 " +
  "[&::-moz-range-thumb]:border-primary " +
  "[&::-moz-range-thumb]:shadow-sm " +
  "[&::-moz-range-thumb]:cursor-pointer " +
  // hide the native firefox track
  "[&::-moz-range-track]:bg-transparent " +
  "[&::-moz-range-track]:h-0";

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

  // ─── Single value ────────────────────────────────────────────────────────

  if (!isRange) {
    return (
      <div className={cn("relative flex w-full items-center", className)}>
        {/* Custom track */}
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
            "relative w-full h-5 appearance-none bg-transparent cursor-pointer",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            THUMB,
          )}
        />
      </div>
    );
  }

  // ─── Range (two thumbs) ──────────────────────────────────────────────────

  function handleLower(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Math.min(Number(e.target.value), upper - step);
    onValueChange([v, upper]);
  }

  function handleUpper(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Math.max(Number(e.target.value), lower + step);
    onValueChange([lower, v]);
  }

  // When lower thumb reaches the upper limit, raise its z-index so it stays
  // accessible when both thumbs are stacked at the same position.
  const lowerOnTop = lower >= max - step;

  // Both inputs are pointer-events:none so only their thumbs receive events.
  // inset-0 pins all four edges to the containing block — more reliable than
  // w-full/h-full which can resolve against a different ancestor in flex layouts.
  const rangeInput = cn(
    "absolute inset-0 appearance-none bg-transparent cursor-pointer",
    "pointer-events-none",
    // re-enable pointer events on thumb only (webkit + firefox)
    "[&::-webkit-slider-thumb]:pointer-events-auto",
    "[&::-moz-range-thumb]:pointer-events-auto",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    THUMB,
  );

  return (
    <div className={cn("relative flex w-full items-center h-5", className)}>
      {/* Custom track */}
      <div className="pointer-events-none absolute w-full top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-muted">
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
        className={cn(rangeInput, lowerOnTop ? "z-[3]" : "z-[1]")}
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
        className={cn(rangeInput, lowerOnTop ? "z-[1]" : "z-[3]")}
      />
    </div>
  );
}
