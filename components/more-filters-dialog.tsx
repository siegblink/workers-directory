"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

interface MoreFiltersDialogProps {
  // Dialog state
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // Filter state values (for initialization)
  selectedServices: string[];
  selectedRatings: number[];
  onlineOnly: boolean;
  verifiedOnly: boolean;
  distanceRange: number[];
  priceRange: number[];
  minResponseTime: number;
  minJobsCompleted: number;

  // Callbacks for applying filters
  onApplyFilters: (filters: {
    selectedServices: string[];
    selectedRatings: number[];
    onlineOnly: boolean;
    verifiedOnly: boolean;
    distanceRange: number[];
    priceRange: number[];
    minResponseTime: number;
    minJobsCompleted: number;
  }) => void;

  // Data
  professions: string[];
}

export function MoreFiltersDialog({
  open,
  onOpenChange,
  selectedServices,
  selectedRatings,
  onlineOnly,
  verifiedOnly,
  distanceRange,
  priceRange,
  minResponseTime,
  minJobsCompleted,
  onApplyFilters,
}: MoreFiltersDialogProps) {
  // Temporary state for dialog filters
  const [tempSelectedServices, setTempSelectedServices] = useState<string[]>(
    [],
  );
  const [tempSelectedRatings, setTempSelectedRatings] = useState<number[]>([]);
  const [tempOnlineOnly, setTempOnlineOnly] = useState(false);
  const [tempVerifiedOnly, setTempVerifiedOnly] = useState(false);
  const [tempDistanceRange, setTempDistanceRange] = useState([0, 50]);
  const [tempPriceRange, setTempPriceRange] = useState([0, 1000]);
  const [tempMinResponseTime, setTempMinResponseTime] = useState(180);
  const [tempMinJobsCompleted, setTempMinJobsCompleted] = useState(0);

  // Custom input mode toggles
  const [isDistanceCustom, setIsDistanceCustom] = useState(false);
  const [isPriceCustom, setIsPriceCustom] = useState(false);
  const [isResponseTimeCustom, setIsResponseTimeCustom] = useState(false);
  const [isJobsCompletedCustom, setIsJobsCompletedCustom] = useState(false);

  // Sync temp state with props when dialog opens
  useEffect(() => {
    if (open) {
      setTempSelectedServices([...selectedServices]);
      setTempSelectedRatings([...selectedRatings]);
      setTempOnlineOnly(onlineOnly);
      setTempVerifiedOnly(verifiedOnly);
      setTempDistanceRange([...distanceRange]);
      setTempPriceRange([...priceRange]);
      setTempMinResponseTime(minResponseTime);
      setTempMinJobsCompleted(minJobsCompleted);
    }
  }, [
    open,
    selectedServices,
    selectedRatings,
    onlineOnly,
    verifiedOnly,
    distanceRange,
    priceRange,
    minResponseTime,
    minJobsCompleted,
  ]);

  const handleRatingToggle = (rating: number) => {
    setTempSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating],
    );
  };

  // Custom input handlers
  const handleDistanceMinChange = (value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setTempDistanceRange([Math.max(0, numValue), tempDistanceRange[1]]);
  };

  const handleDistanceMaxChange = (value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setTempDistanceRange([tempDistanceRange[0], Math.max(0, numValue)]);
  };

  const handlePriceMinChange = (value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setTempPriceRange([Math.max(0, numValue), tempPriceRange[1]]);
  };

  const handlePriceMaxChange = (value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setTempPriceRange([tempPriceRange[0], Math.max(0, numValue)]);
  };

  const handleResponseTimeChange = (value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setTempMinResponseTime(Math.max(0, numValue));
  };

  const handleJobsCompletedChange = (value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setTempMinJobsCompleted(Math.max(0, numValue));
  };

  const handleApply = () => {
    onApplyFilters({
      selectedServices: tempSelectedServices,
      selectedRatings: tempSelectedRatings,
      onlineOnly: tempOnlineOnly,
      verifiedOnly: tempVerifiedOnly,
      distanceRange: tempDistanceRange,
      priceRange: tempPriceRange,
      minResponseTime: tempMinResponseTime,
      minJobsCompleted: tempMinJobsCompleted,
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>More Filters</DialogTitle>
          <DialogDescription>
            Customize your search with advanced filtering options
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* All Rating Options */}
            <Field>
              <FieldLabel className="text-sm font-medium mb-3 block">
                Minimum Rating
              </FieldLabel>
              <div className="grid grid-cols-2 gap-3">
                {[5, 4.5, 4, 3.5].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <Checkbox
                      id={`dialog-rating-${rating}`}
                      checked={tempSelectedRatings.includes(rating)}
                      onCheckedChange={() => handleRatingToggle(rating)}
                    />
                    <Label
                      htmlFor={`dialog-rating-${rating}`}
                      className="text-sm font-normal cursor-pointer flex items-center gap-1"
                    >
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {rating}+ stars
                    </Label>
                  </div>
                ))}
              </div>
            </Field>

            {/* Distance Range */}
            <Field>
              <div className="flex items-center justify-between mb-2">
                <FieldLabel className="text-sm font-medium">
                  Distance Range
                </FieldLabel>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDistanceCustom(!isDistanceCustom)}
                >
                  {isDistanceCustom ? "Slider" : "Custom"}
                </Button>
              </div>
              {isDistanceCustom ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Min (km)
                    </div>
                    <InputGroup>
                      <InputGroupInput
                        type="number"
                        value={tempDistanceRange[0]}
                        onChange={(e) =>
                          handleDistanceMinChange(e.target.value)
                        }
                        min={0}
                        placeholder="0"
                      />
                    </InputGroup>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Max (km)
                    </div>
                    <InputGroup>
                      <InputGroupInput
                        type="number"
                        value={tempDistanceRange[1]}
                        onChange={(e) =>
                          handleDistanceMaxChange(e.target.value)
                        }
                        min={0}
                        placeholder="50"
                      />
                    </InputGroup>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-sm text-muted-foreground mb-2">
                    {tempDistanceRange[0]} - {tempDistanceRange[1]} km
                  </div>
                  <Slider
                    value={tempDistanceRange}
                    onValueChange={setTempDistanceRange}
                    max={50}
                    min={0}
                    step={1}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0 km</span>
                    <span>50+ km</span>
                  </div>
                </>
              )}
            </Field>

            <Separator />

            {/* Price Range */}
            <Field>
              <div className="flex items-center justify-between mb-2">
                <FieldLabel className="text-sm font-medium">
                  Price Range
                </FieldLabel>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPriceCustom(!isPriceCustom)}
                >
                  {isPriceCustom ? "Slider" : "Custom"}
                </Button>
              </div>
              {isPriceCustom ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Min (₱/hr)
                    </div>
                    <InputGroup>
                      <InputGroupInput
                        type="number"
                        value={tempPriceRange[0]}
                        onChange={(e) => handlePriceMinChange(e.target.value)}
                        min={0}
                        placeholder="0"
                      />
                    </InputGroup>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Max (₱/hr)
                    </div>
                    <InputGroup>
                      <InputGroupInput
                        type="number"
                        value={tempPriceRange[1]}
                        onChange={(e) => handlePriceMaxChange(e.target.value)}
                        min={0}
                        placeholder="1000"
                      />
                    </InputGroup>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-sm text-muted-foreground mb-2">
                    ₱{tempPriceRange[0]} - ₱{tempPriceRange[1]}/hr
                  </div>
                  <Slider
                    value={tempPriceRange}
                    onValueChange={setTempPriceRange}
                    max={1000}
                    min={0}
                    step={5}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₱0</span>
                    <span>₱1000+</span>
                  </div>
                </>
              )}
            </Field>

            <Separator />

            {/* Availability */}
            <Field>
              <FieldLabel className="text-sm font-medium mb-3 block">
                Availability
              </FieldLabel>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="dialog-online"
                    checked={tempOnlineOnly}
                    onCheckedChange={(checked) =>
                      setTempOnlineOnly(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="dialog-online"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Online Now
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="dialog-verified"
                    checked={tempVerifiedOnly}
                    onCheckedChange={(checked) =>
                      setTempVerifiedOnly(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="dialog-verified"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Verified Workers Only
                  </Label>
                </div>
              </div>
            </Field>

            <Separator />

            {/* Response Time */}
            <Field>
              <div className="flex items-center justify-between mb-2">
                <FieldLabel className="text-sm font-medium">
                  Maximum Response Time
                </FieldLabel>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsResponseTimeCustom(!isResponseTimeCustom)}
                >
                  {isResponseTimeCustom ? "Slider" : "Custom"}
                </Button>
              </div>
              {isResponseTimeCustom ? (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Minutes
                  </div>
                  <InputGroup>
                    <InputGroupInput
                      type="number"
                      value={tempMinResponseTime}
                      onChange={(e) => handleResponseTimeChange(e.target.value)}
                      min={0}
                      placeholder="180"
                    />
                  </InputGroup>
                </div>
              ) : (
                <>
                  <div className="text-sm text-muted-foreground mb-2">
                    {tempMinResponseTime} minutes
                  </div>
                  <Slider
                    value={[tempMinResponseTime]}
                    onValueChange={([value]) => setTempMinResponseTime(value)}
                    max={180}
                    min={15}
                    step={15}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>15 min</span>
                    <span>180+ min</span>
                  </div>
                </>
              )}
            </Field>

            <Separator />

            {/* Jobs Completed */}
            <Field>
              <div className="flex items-center justify-between mb-2">
                <FieldLabel className="text-sm font-medium">
                  Minimum Jobs Completed
                </FieldLabel>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setIsJobsCompletedCustom(!isJobsCompletedCustom)
                  }
                >
                  {isJobsCompletedCustom ? "Slider" : "Custom"}
                </Button>
              </div>
              {isJobsCompletedCustom ? (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Number of jobs
                  </div>
                  <InputGroup>
                    <InputGroupInput
                      type="number"
                      value={tempMinJobsCompleted}
                      onChange={(e) =>
                        handleJobsCompletedChange(e.target.value)
                      }
                      min={0}
                      placeholder="0"
                    />
                  </InputGroup>
                </div>
              ) : (
                <>
                  <div className="text-sm text-muted-foreground mb-2">
                    {tempMinJobsCompleted} jobs
                  </div>
                  <Slider
                    value={[tempMinJobsCompleted]}
                    onValueChange={([value]) => setTempMinJobsCompleted(value)}
                    max={500}
                    min={0}
                    step={10}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0 jobs</span>
                    <span>500+ jobs</span>
                  </div>
                </>
              )}
            </Field>
          </div>
        </ScrollArea>
        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleApply}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
