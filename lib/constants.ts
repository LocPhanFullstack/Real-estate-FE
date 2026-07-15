import { AmenityEnum, HighlightEnum, PropertyTypeEnum } from "@/types/enum";
import {
  Bath,
  Building,
  Bus,
  Cable,
  Car,
  Castle,
  Cigarette,
  Droplets,
  Dumbbell,
  Flame,
  Hammer,
  Home,
  LucideIcon,
  Maximize,
  Mountain,
  PawPrint,
  PhoneCall,
  Satellite,
  ShieldCheck,
  Thermometer,
  Trees,
  Tv,
  Volume1,
  Warehouse,
  Waves,
  Wifi,
} from "lucide-react";

export const NAVBAR_HEIGHT = 52;

export interface FilterIconOption {
  value: PropertyTypeEnum | AmenityEnum | HighlightEnum;
  label: string;
  icon: LucideIcon;
}

export interface FilterOption {
  value: string;
  label: string;
}

export const propertyTypeOptions: FilterIconOption[] = [
  { value: PropertyTypeEnum.Rooms, label: "Rooms", icon: Home },
  { value: PropertyTypeEnum.Tinyhouse, label: "Tinyhouse", icon: Warehouse },
  { value: PropertyTypeEnum.Apartment, label: "Apartment", icon: Building },
  { value: PropertyTypeEnum.Villa, label: "Villa", icon: Castle },
  { value: PropertyTypeEnum.Townhouse, label: "Townhouse", icon: Home },
  { value: PropertyTypeEnum.Cottage, label: "Cottage", icon: Trees },
];

export const amenityOptions: FilterIconOption[] = [
  { value: AmenityEnum.WasherDryer, label: "Washer/Dryer", icon: Waves },
  { value: AmenityEnum.AirConditioning, label: "Air Conditioning", icon: Thermometer },
  { value: AmenityEnum.Dishwasher, label: "Dishwasher", icon: Waves },
  { value: AmenityEnum.HighSpeedInternet, label: "High-Speed Internet", icon: Wifi },
  { value: AmenityEnum.HardwoodFloors, label: "Hardwood Floors", icon: Home },
  { value: AmenityEnum.WalkInClosets, label: "Walk-in Closets", icon: Maximize },
  { value: AmenityEnum.Microwave, label: "Microwave", icon: Tv },
  { value: AmenityEnum.Refrigerator, label: "Refrigerator", icon: Thermometer },
  { value: AmenityEnum.Pool, label: "Pool", icon: Waves },
  { value: AmenityEnum.Gym, label: "Gym", icon: Dumbbell },
  { value: AmenityEnum.Parking, label: "Parking", icon: Car },
  { value: AmenityEnum.PetsAllowed, label: "Pets Allowed", icon: PawPrint },
  { value: AmenityEnum.WiFi, label: "WiFi", icon: Wifi },
];

export const highlightOptions: FilterIconOption[] = [
  { value: HighlightEnum.HighSpeedInternetAccess, label: "High-Speed Internet Access", icon: Wifi },
  { value: HighlightEnum.WasherDryer, label: "Washer/Dryer", icon: Waves },
  { value: HighlightEnum.AirConditioning, label: "Air Conditioning", icon: Thermometer },
  { value: HighlightEnum.Heating, label: "Heating", icon: Flame },
  { value: HighlightEnum.SmokeFree, label: "Smoke Free", icon: Cigarette },
  { value: HighlightEnum.CableReady, label: "Cable Ready", icon: Cable },
  { value: HighlightEnum.SatelliteTV, label: "Satellite TV", icon: Satellite },
  { value: HighlightEnum.DoubleVanities, label: "Double Vanities", icon: Bath },
  { value: HighlightEnum.TubShower, label: "Tub/Shower", icon: Droplets },
  { value: HighlightEnum.Intercom, label: "Intercom", icon: PhoneCall },
  { value: HighlightEnum.SprinklerSystem, label: "Sprinkler System", icon: ShieldCheck },
  { value: HighlightEnum.RecentlyRenovated, label: "Recently Renovated", icon: Hammer },
  { value: HighlightEnum.CloseToTransit, label: "Close to Transit", icon: Bus },
  { value: HighlightEnum.GreatView, label: "Great View", icon: Mountain },
  { value: HighlightEnum.QuietNeighborhood, label: "Quiet Neighborhood", icon: Volume1 },
];

export const bedsOptions: FilterOption[] = [
  { value: "any", label: "Any beds" },
  { value: "1", label: "1+ bed" },
  { value: "2", label: "2+ beds" },
  { value: "3", label: "3+ beds" },
  { value: "4", label: "4+ beds" },
];

export const bathsOptions: FilterOption[] = [
  { value: "any", label: "Any baths" },
  { value: "1", label: "1+ bath" },
  { value: "2", label: "2+ baths" },
  { value: "3", label: "3+ baths" },
];

export function getOptionLabel(options: FilterOption[], value: string, fallback: string): string {
  return options.find((o) => o.value === value)?.label ?? fallback;
}
