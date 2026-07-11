import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  amenityOptions,
  bathsOptions,
  bedsOptions,
  getOptionLabel,
  propertyTypeOptions,
} from "@/lib/constants";
import { cleanParams, cn } from "@/lib/utils";
import { initialState, setFilters } from "@/state";
import { useAppSelector } from "@/state/redux";
import { debounce } from "lodash";
import { CalendarIcon, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

const FilterFull = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useAppSelector((state) => state.global.filters);
  const [localFilters, setLocalFilters] = useState(initialState.filters);
  const isFiltersFullOpen = useAppSelector((state) => state.global.isFiltersFullOpen);

  const updateURL = useMemo(
    () =>
      debounce((newFilters: FiltersState) => {
        const cleanFilters = cleanParams(newFilters);
        const updatedSearchParams = new URLSearchParams();

        Object.entries(cleanFilters).forEach(([key, value]) => {
          updatedSearchParams.set(key, Array.isArray(value) ? value.join(",") : value.toString());
        });

        router.push(`${pathname}?${updatedSearchParams.toString()}`);
      }, 500),
    [pathname, router],
  );

  const handleSubmit = () => {
    dispatch(setFilters(localFilters));
    updateURL(localFilters);
  };

  const handleReset = () => {
    setLocalFilters(initialState.filters);
    dispatch(setFilters(initialState.filters));
    updateURL(initialState.filters);
  };

  if (!isFiltersFullOpen) return null;

  return (
    <div className="bg-white rounded-lg p-4 h-full overflow-auto">
      <div className="flex flex-col space-y-6">
        {/* Location */}
        <div>
          <h4 className="font-bold mb-2">Location</h4>
          <div className="flex items-center rounded-xl border border-primary-400 overflow-hidden focus-within:ring-4 focus-within:ring-blue-500/20 transition-all">
            <Input
              placeholder="Enter location"
              value={filters.location}
              onChange={(e) => setLocalFilters((prev) => ({ ...prev, location: e.target.value }))}
              className="rounded-none border-0 shadow-none focus-visible:ring-0"
            />
            <Button className="rounded-none border-0 border-l border-l-primary-400 shadow-none hover:bg-primary-200  bg-primary-100 px-4 cursor-pointer">
              <Search className="w-4 h-4 text-primary-800" />
            </Button>
          </div>
        </div>

        {/* Property Type */}
        <div>
          <h4 className="font-bold mb-2">Property Type</h4>
          <div className="grid grid-cols-2 gap-4">
            {propertyTypeOptions.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer",
                  localFilters.propertyType === option.value ? "border-black" : "border-gray-200",
                )}
                onClick={() =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    propertyType: option.value,
                  }))
                }
              >
                <option.icon className="w-6 h-6 mb-2" />
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="font-bold mb-2">Price Range (Monthly)</h4>
          <Slider
            min={0}
            max={10000}
            step={100}
            value={[localFilters.priceRange[0] ?? 0, localFilters.priceRange[1] ?? 10000]}
            onValueChange={(value: any) =>
              setLocalFilters((prev) => ({
                ...prev,
                priceRange: value as [number, number],
              }))
            }
          />
          <div className="flex justify-between mt-2">
            <span>${localFilters.priceRange[0] ?? 0}</span>
            <span>${localFilters.priceRange[1] ?? 10000}</span>
          </div>
        </div>

        {/* Beds and Baths */}
        <div className="flex gap-4">
          <div className="flex-1">
            <h4 className="font-bold mb-2">Beds</h4>
            <Select
              value={localFilters.beds || "any"}
              onValueChange={(value: any) => setLocalFilters((prev) => ({ ...prev, beds: value }))}
            >
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue placeholder="Beds">
                  {(value) => getOptionLabel(bedsOptions, value, "Beds")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} align="start">
                {bedsOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <h4 className="font-bold mb-2">Baths</h4>
            <Select
              value={localFilters.baths || "any"}
              onValueChange={(value: any) => setLocalFilters((prev) => ({ ...prev, baths: value }))}
            >
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue placeholder="Baths">
                  {(value) => getOptionLabel(bathsOptions, value, "Baths")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} align="start">
                {bathsOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Square Feet */}
        <div>
          <h4 className="font-bold mb-2">Square Feet</h4>
          <Slider
            min={0}
            max={5000}
            step={100}
            value={[localFilters.squareFeet[0] ?? 0, localFilters.squareFeet[1] ?? 5000]}
            onValueChange={(value) =>
              setLocalFilters((prev) => ({
                ...prev,
                squareFeet: value as [number, number],
              }))
            }
            className="[&>.bar]:bg-primary-700"
          />
          <div className="flex justify-between mt-2">
            <span>{localFilters.squareFeet[0] ?? 0}m²</span>
            <span>{localFilters.squareFeet[1] ?? 5000}m²</span>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h4 className="font-bold mb-2">Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {amenityOptions.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "flex items-center space-x-2 p-2 border rounded-lg hover:cursor-pointer",
                  localFilters.amenities.includes(option.value)
                    ? "border-black"
                    : "border-gray-200",
                )}
                onClick={() =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    amenities: prev.amenities.includes(option.value)
                      ? prev.amenities.filter((a) => a !== option.value)
                      : [...prev.amenities, option.value],
                  }))
                }
              >
                <option.icon className="w-5 h-5 hover:cursor-pointer" />
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Available From */}
        <div>
          <h4 className="font-bold mb-2">Available From</h4>
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-xl",
                    localFilters.availableFrom === "any" && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {localFilters.availableFrom !== "any"
                    ? format(new Date(localFilters.availableFrom), "dd/MM/yyyy")
                    : "DD/MM/YYYY"}
                </Button>
              }
            />
            <PopoverContent className="w-full p-0" align="start" side="bottom">
              <Calendar
                mode="single"
                selected={
                  localFilters.availableFrom !== "any"
                    ? new Date(localFilters.availableFrom)
                    : undefined
                }
                onSelect={(date) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    availableFrom: date ? format(date, "yyyy-MM-dd") : "any",
                  }))
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Apply and reset button */}
        <div className="flex gap-4 mt-6">
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-primary-700 text-white rounded-xl cursor-pointer"
          >
            APPLY
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 rounded-xl cursor-pointer"
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterFull;
