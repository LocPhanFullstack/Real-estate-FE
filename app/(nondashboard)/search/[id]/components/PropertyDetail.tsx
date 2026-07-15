import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { amenityOptions, highlightOptions } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useGetPropertyQuery } from "@/state/api";
import { AmenityEnum, HighlightEnum } from "@/types/enum";
import { HelpCircle } from "lucide-react";

const PropertyDetailSkeleton = () => {
  return (
    <div className="mb-6">
      {/* Amenities */}
      <div>
        <Skeleton className="h-7 w-56 my-3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center border rounded-xl py-8 px-4">
              <Skeleton className="w-8 h-8 mb-2 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="mt-12 mb-16">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-4 w-full">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center border rounded-xl py-8 px-4">
              <Skeleton className="w-8 h-8 mb-2 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Section */}
      <div>
        <Skeleton className="h-6 w-48 mb-5" />
        <Skeleton className="h-4 w-full max-w-xl mt-2" />

        <div className="mt-8">
          <div className="grid w-full grid-cols-3 gap-2">
            <Skeleton className="h-9 rounded-lg" />
            <Skeleton className="h-9 rounded-lg" />
            <Skeleton className="h-9 rounded-lg" />
          </div>
          <div className="w-1/3 mt-5 space-y-2">
            <Skeleton className="h-4 w-32 mb-2" />
            <hr />
            <div className="flex justify-between py-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-12" />
            </div>
            <hr />
            <div className="flex justify-between py-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-12" />
            </div>
            <hr />
          </div>
        </div>
      </div>
    </div>
  );
};

const PropertyDetail = ({ propertyId }: PropertyDetailsProps) => {
  const { data: property, isError, isLoading, isFetching } = useGetPropertyQuery(propertyId);

  if (isLoading) return <PropertyDetailSkeleton />;
  if (isError || !property) {
    return <div className="py-16 text-center text-gray-500">Property details not available</div>;
  }

  return (
    <div className={cn("mb-6 transition-opacity", isFetching && "opacity-60")}>
      {/* Amenities */}
      <div>
        <h2 className="text-xl font-semibold my-3">Property Amenities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {property.amenities.map((amenity: AmenityEnum) => {
            const option = amenityOptions.find((o) => o.value === amenity);
            const Icon = option?.icon || HelpCircle;
            return (
              <div key={amenity} className="flex flex-col items-center border rounded-xl py-8 px-4">
                <Icon className="w-8 h-8 mb-2 text-gray-700" />
                <span className="text-sm text-center text-gray-700">{option?.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Highlights */}
      <div className="mt-12 mb-16">
        <h3 className="text-xl font-semibold text-primary-800">Highlights</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-4 w-full">
          {property.highlights.map((highlight: HighlightEnum) => {
            const option = highlightOptions.find((o) => o.value === highlight);
            const Icon = option?.icon || HelpCircle;
            return (
              <div
                key={highlight}
                className="flex flex-col items-center border rounded-xl py-8 px-4"
              >
                <Icon className="w-8 h-8 mb-2 text-gray-700" />
                <span className="text-sm text-center text-gray-700">{option?.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs Section */}
      <div>
        <h3 className="text-xl font-semibold text-primary-800 mb-5">Fees and Policies</h3>
        <p className="text-sm text-primary-600 mt-2">
          The fees below are based on community-supplied data and may exclude additional fees and
          utilities.
        </p>
        <Tabs defaultValue="required-fees" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="required-fees">Required Fees</TabsTrigger>
            <TabsTrigger value="pets">Pets</TabsTrigger>
            <TabsTrigger value="parking">Parking</TabsTrigger>
          </TabsList>
          <TabsContent value="required-fees" className="w-1/3">
            <p className="font-semibold mt-5 mb-2">One time move in fees</p>
            <hr />
            <div className="flex justify-between py-2 bg-secondary-50">
              <span className="text-primary-700 font-medium">Application Fee</span>
              <span className="text-primary-700">${property.applicationFee}</span>
            </div>
            <hr />
            <div className="flex justify-between py-2 bg-secondary-50">
              <span className="text-primary-700 font-medium">Security Deposit</span>
              <span className="text-primary-700">${property.securityDeposit}</span>
            </div>
            <hr />
          </TabsContent>
          <TabsContent value="pets">
            <p className="font-semibold mt-5 mb-2">
              Pets are {property.isPetsAllowed ? "allowed" : "not allowed"}
            </p>
          </TabsContent>
          <TabsContent value="parking">
            <p className="font-semibold mt-5 mb-2">
              Parking is {property.isParkingIncluded ? "included" : "not included"}
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PropertyDetail;
