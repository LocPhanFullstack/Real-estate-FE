import { setFilters, setViewMode, toggleFiltersFullOpen } from "@/state";
import { useAppSelector } from "@/state/redux";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";
import { cleanParams, cn, formatPriceValue } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Filter, Grid, List, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bathsOptions, bedsOptions, getOptionLabel, propertyTypeOptions } from "@/lib/constants";
import { toast } from "sonner";

const FilterBar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useAppSelector((state) => state.global.filters);
  const isFiltersFullOpen = useAppSelector((state) => state.global.isFiltersFullOpen);

  const viewMode = useAppSelector((state) => state.global.viewMode);
  const [searchInput, setSearchInput] = useState(filters.location);

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

  const handleFilterChange = (key: string, value: any, isMin: boolean | null) => {
    let newValue = value;
    if (key === "priceRange" || key === "squareFeet") {
      const currentArrayRange = [...filters[key]];
      if (isMin !== null) {
        const index = isMin ? 0 : 1;
        currentArrayRange[index] = value === "any" ? null : Number(value);
      }
      newValue = currentArrayRange;
    } else if (key === "coordinates") {
      newValue = value === "any" ? [0, 0] : value.map(Number);
    }

    const newFilters = { ...filters, [key]: newValue };
    dispatch(setFilters(newFilters));
    updateURL(newFilters);
  };

  const handleLocationSearch = async () => {
    if (!searchInput.trim()) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchInput,
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&fuzzyMatch=true`,
      );

      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const updatedFilters = {
          ...filters,
          location: searchInput,
          coordinates: [lng, lat] as [number, number],
        };
        dispatch(setFilters({ location: searchInput, coordinates: [lng, lat] }));
        updateURL(updatedFilters);
      } else {
        toast.error("Location not found. Please try a different search.");
      }
    } catch (err) {
      console.error("Error search location:", err);
      toast.error("Failed to search location. Please try again.");
    }
  };

  useEffect(() => {
    setSearchInput(filters.location);
  }, [filters.location]);

  return (
    <div className="flex justify-between items-center w-full py-5">
      {/* Filters */}
      <div className="flex justify-between items-center gap-4 p-2">
        {/* All filters */}
        <Button
          variant="outline"
          className={cn(
            "gap-2 rounded-xl border-primary-400 hover:bg-primary-500! hover:text-primary-100! py-4 cursor-pointer",
            isFiltersFullOpen && "bg-primary-700! text-primary-100!",
          )}
          onClick={() => dispatch(toggleFiltersFullOpen())}
        >
          <Filter className="w-4 h-4" />
          <span>All Filters</span>
        </Button>

        {/* Search Location */}
        <div className="flex items-center rounded-xl border border-primary-400 overflow-hidden focus-within:ring-4 focus-within:ring-blue-500/20 transition-all">
          <Input
            placeholder="Search location"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-40 rounded-none border-0 shadow-none focus-visible:ring-0 py-3"
          />
          <Button
            className="rounded-none border-0 border-l border-l-primary-400 shadow-none hover:bg-primary-200  bg-primary-100 px-4 cursor-pointer"
            onClick={handleLocationSearch}
          >
            <Search className="w-4 h-4 text-primary-800" />
          </Button>
        </div>

        {/* Price range */}
        <div className="flex gap-1">
          {/* Minimum price selector */}
          <Select
            value={filters.priceRange[0]?.toString() || "any"}
            onValueChange={(value) => handleFilterChange("priceRange", value, true)}
          >
            <SelectTrigger className="min-w-16 rounded-xl border-primary-400">
              <SelectValue>{formatPriceValue(filters.priceRange[0], true)}</SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white" alignItemWithTrigger={false} align="start">
              <SelectItem value="any">Any Min Price</SelectItem>
              {[500, 1000, 1500, 2000, 3000, 5000, 10000].map((price) => (
                <SelectItem key={price} value={price.toString()}>
                  ${price / 1000}k+
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Maximum Price Selector */}
          <Select
            value={filters.priceRange[1]?.toString() || "any"}
            onValueChange={(value) => handleFilterChange("priceRange", value, false)}
          >
            <SelectTrigger className="min-w-16 rounded-xl border-primary-400">
              <SelectValue>{formatPriceValue(filters.priceRange[1], false)}</SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white" alignItemWithTrigger={false} align="start">
              <SelectItem value="any">Any Max Price</SelectItem>
              {[1000, 2000, 3000, 5000, 10000].map((price) => (
                <SelectItem key={price} value={price.toString()}>
                  &lt;${price / 1000}k
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Beds and baths */}
        <div className="flex gap-1">
          {/* Beds */}
          <Select
            value={filters.beds}
            onValueChange={(value) => handleFilterChange("beds", value, null)}
          >
            <SelectTrigger className="rounded-xl border-primary-400 min-w-16">
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

          {/* Baths */}
          <Select
            value={filters.baths}
            onValueChange={(value) => handleFilterChange("baths", value, null)}
          >
            <SelectTrigger className="rounded-xl border-primary-400 min-w-16">
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

        {/* Property Type */}
        <Select
          value={filters.propertyType || "any"}
          onValueChange={(value) => handleFilterChange("propertyType", value, null)}
        >
          <SelectTrigger className="rounded-xl border-primary-400 min-w-16 max-w-52">
            <SelectValue className="truncate" placeholder="Home Type">
              {(value) => {
                if (value === "any") return "Any Property Type";
                const option = propertyTypeOptions.find((o) => o.value === value);
                if (!option) return "Home Type";
                const Icon = option.icon;
                return (
                  <div className="flex items-center">
                    <Icon className="w-4 h-4 mr-2" />
                    <span>{option.label}</span>
                  </div>
                );
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white" alignItemWithTrigger={false} align="start">
            <SelectItem value="any">Any Property Type</SelectItem>
            {propertyTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center">
                  <option.icon className="w-4 h-4 mr-2" />
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* View mode */}
      <div className="flex justify-between items-center gap-4 p-2">
        <div className="flex border rounded-xl divide-x divide-border overflow-hidden">
          <Button
            variant="ghost"
            aria-pressed={viewMode === "list"}
            className={cn(
              "px-3 py-1 rounded-none cursor-pointer",
              viewMode === "list"
                ? "bg-primary-700 text-primary-50 pointer-events-none"
                : "hover:bg-primary-100",
            )}
            onClick={() => dispatch(setViewMode("list"))}
          >
            <List className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            aria-pressed={viewMode === "grid"}
            className={cn(
              "px-3 py-1 rounded-none cursor-pointer",
              viewMode === "grid"
                ? "bg-primary-700 text-primary-50 pointer-events-none"
                : "hover:bg-primary-100",
            )}
            onClick={() => dispatch(setViewMode("grid"))}
          >
            <Grid className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
