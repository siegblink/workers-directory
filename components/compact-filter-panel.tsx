"use client";

import { Filter, X } from "lucide-react";
import { useState } from "react";
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
}: CompactFilterPanelProps) {
  const [isDistanceCustom, setIsDistanceCustom] = useState(false);
  const [isPriceCustom, setIsPriceCustom] = useState(false);

  const handleDistanceMinChange = (value: string) => {
    const numValue = parseInt(value, 10) || 0;
    onDistanceRangeChange([Math.max(0, numValue), distanceRange[1]]);
  };

  const handleDistanceMaxChange = (value: string) => {
    const numValue = parseInt(value, 10) || 0;
    onDistanceRangeChange([distanceRange[0], Math.max(0, numValue)]);
  };

  const handlePriceMinChange = (value: string) => {
    const numValue = parseInt(value, 10) || 0;
    onPriceRangeChange([Math.max(0, numValue), priceRange[1]]);
  };

  const handlePriceMaxChange = (value: string) => {
    const numValue = parseInt(value, 10) || 0;
    onPriceRangeChange([priceRange[0], Math.max(0, numValue)]);
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
                    value={distanceRange[0]}
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
                    value={distanceRange[1]}
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
                    value={priceRange[0]}
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
                    value={priceRange[1]}
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
