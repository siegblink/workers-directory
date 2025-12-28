"use client";

import { Filter, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

interface CompactFilterPanelProps {
  distanceRange: number[];
  onDistanceRangeChange: (value: number[]) => void;
  priceRange: number[];
  onPriceRangeChange: (value: number[]) => void;
  onOpenMoreFilters: () => void;
  activeFiltersCount: number;
  onClearAllFilters: () => void;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
}

/**
 * Compact filter panel component for search filters
 * Displays distance range, price range, and quick filter actions
 */
export function CompactFilterPanel({
  distanceRange,
  onDistanceRangeChange,
  priceRange,
  onPriceRangeChange,
  onOpenMoreFilters,
  activeFiltersCount,
  onClearAllFilters,
  onTypingStart,
  onTypingEnd,
}: CompactFilterPanelProps) {
  const [isDistanceCustom, setIsDistanceCustom] = useState(false);
  const [isPriceCustom, setIsPriceCustom] = useState(false);

  // Local state for input values to allow smooth typing
  const [distanceMinInput, setDistanceMinInput] = useState(
    distanceRange[0].toString(),
  );
  const [distanceMaxInput, setDistanceMaxInput] = useState(
    distanceRange[1].toString(),
  );
  const [priceMinInput, setPriceMinInput] = useState(priceRange[0].toString());
  const [priceMaxInput, setPriceMaxInput] = useState(priceRange[1].toString());

  // Refs for debouncing
  const distanceDebounceRef = useRef<NodeJS.Timeout>();
  const priceDebounceRef = useRef<NodeJS.Timeout>();

  // Track if user is actively typing in custom inputs
  const isTypingDistanceRef = useRef(false);
  const isTypingPriceRef = useRef(false);

  // Update local state when props change (e.g., from Clear All or slider)
  // But only if user is not actively typing in custom inputs
  useEffect(() => {
    if (!isTypingDistanceRef.current) {
      setDistanceMinInput(distanceRange[0].toString());
      setDistanceMaxInput(distanceRange[1].toString());
    }
  }, [distanceRange]);

  useEffect(() => {
    if (!isTypingPriceRef.current) {
      setPriceMinInput(priceRange[0].toString());
      setPriceMaxInput(priceRange[1].toString());
    }
  }, [priceRange]);

  const handleDistanceMinChange = (value: string) => {
    // Mark that user is typing
    isTypingDistanceRef.current = true;
    onTypingStart?.();

    // Update local state immediately for smooth typing
    setDistanceMinInput(value);

    // Clear previous timeout
    if (distanceDebounceRef.current) {
      clearTimeout(distanceDebounceRef.current);
    }

    // Debounce the parent state update
    distanceDebounceRef.current = setTimeout(() => {
      const numValue = value === "" ? 0 : parseInt(value, 10);
      if (!isNaN(numValue)) {
        onDistanceRangeChange([Math.max(0, numValue), distanceRange[1]]);
      }
      // Reset typing flag after update completes
      isTypingDistanceRef.current = false;
      onTypingEnd?.();
    }, 500);
  };

  const handleDistanceMaxChange = (value: string) => {
    // Mark that user is typing
    isTypingDistanceRef.current = true;
    onTypingStart?.();

    // Update local state immediately for smooth typing
    setDistanceMaxInput(value);

    // Clear previous timeout
    if (distanceDebounceRef.current) {
      clearTimeout(distanceDebounceRef.current);
    }

    // Debounce the parent state update
    distanceDebounceRef.current = setTimeout(() => {
      const numValue = value === "" ? 0 : parseInt(value, 10);
      if (!isNaN(numValue)) {
        onDistanceRangeChange([distanceRange[0], Math.max(0, numValue)]);
      }
      // Reset typing flag after update completes
      isTypingDistanceRef.current = false;
      onTypingEnd?.();
    }, 500);
  };

  const handlePriceMinChange = (value: string) => {
    // Mark that user is typing
    isTypingPriceRef.current = true;
    onTypingStart?.();

    // Update local state immediately for smooth typing
    setPriceMinInput(value);

    // Clear previous timeout
    if (priceDebounceRef.current) {
      clearTimeout(priceDebounceRef.current);
    }

    // Debounce the parent state update
    priceDebounceRef.current = setTimeout(() => {
      const numValue = value === "" ? 0 : parseInt(value, 10);
      if (!isNaN(numValue)) {
        onPriceRangeChange([Math.max(0, numValue), priceRange[1]]);
      }
      // Reset typing flag after update completes
      isTypingPriceRef.current = false;
      onTypingEnd?.();
    }, 500);
  };

  const handlePriceMaxChange = (value: string) => {
    // Mark that user is typing
    isTypingPriceRef.current = true;
    onTypingStart?.();

    // Update local state immediately for smooth typing
    setPriceMaxInput(value);

    // Clear previous timeout
    if (priceDebounceRef.current) {
      clearTimeout(priceDebounceRef.current);
    }

    // Debounce the parent state update
    priceDebounceRef.current = setTimeout(() => {
      const numValue = value === "" ? 0 : parseInt(value, 10);
      if (!isNaN(numValue)) {
        onPriceRangeChange([priceRange[0], Math.max(0, numValue)]);
      }
      // Reset typing flag after update completes
      isTypingPriceRef.current = false;
      onTypingEnd?.();
    }, 500);
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-semibold mb-2">Filters</h3>
      </div>

      {/* Distance Range */}
      <Field orientation="vertical">
        <div className="flex items-center justify-between">
          <FieldLabel>Distance Range</FieldLabel>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDistanceCustom(!isDistanceCustom)}
          >
            {isDistanceCustom ? "Slider" : "Custom"}
          </Button>
        </div>
        {isDistanceCustom ? (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-muted-foreground mb-1 block">
                  Min (km)
                </div>
                <InputGroup>
                  <InputGroupInput
                    type="number"
                    value={distanceMinInput}
                    onChange={(e) => handleDistanceMinChange(e.target.value)}
                    min={0}
                    placeholder="0"
                  />
                </InputGroup>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1 block">
                  Max (km)
                </div>
                <InputGroup>
                  <InputGroupInput
                    type="number"
                    value={distanceMaxInput}
                    onChange={(e) => handleDistanceMaxChange(e.target.value)}
                    min={0}
                    placeholder="50"
                  />
                </InputGroup>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="text-sm text-muted-foreground mb-2">
              {distanceRange[0]} - {distanceRange[1]} km
            </div>
            <Slider
              value={distanceRange}
              onValueChange={onDistanceRangeChange}
              max={50}
              min={0}
              step={1}
              className="mb-1"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0 km</span>
              <span>50+ km</span>
            </div>
          </>
        )}
      </Field>

      <Separator />

      {/* Price Range */}
      <Field orientation="vertical">
        <div className="flex items-center justify-between">
          <FieldLabel>Price Range</FieldLabel>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPriceCustom(!isPriceCustom)}
          >
            {isPriceCustom ? "Slider" : "Custom"}
          </Button>
        </div>
        {isPriceCustom ? (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-muted-foreground mb-1 block">
                  Min (₱/hr)
                </div>
                <InputGroup>
                  <InputGroupInput
                    type="number"
                    value={priceMinInput}
                    onChange={(e) => handlePriceMinChange(e.target.value)}
                    min={0}
                    placeholder="0"
                  />
                </InputGroup>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1 block">
                  Max (₱/hr)
                </div>
                <InputGroup>
                  <InputGroupInput
                    type="number"
                    value={priceMaxInput}
                    onChange={(e) => handlePriceMaxChange(e.target.value)}
                    min={0}
                    placeholder="1000"
                  />
                </InputGroup>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="text-sm text-muted-foreground mb-2">
              ₱{priceRange[0]} - ₱{priceRange[1]}/hr
            </div>
            <Slider
              value={priceRange}
              onValueChange={onPriceRangeChange}
              max={1000}
              min={0}
              step={5}
              className="mb-1"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>₱0</span>
              <span>₱1000+</span>
            </div>
          </>
        )}
      </Field>

      <Separator />

      {/* More Filters Button */}
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={onOpenMoreFilters}
      >
        <span className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          More Filters
        </span>
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="ml-2">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={onClearAllFilters}
      >
        <X />
        Clear All
      </Button>
    </div>
  );
}
