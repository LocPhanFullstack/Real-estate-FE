import { Skeleton } from "@/components/ui/skeleton";
import { useGetPropertyQuery } from "@/state/api";
import { Compass, MapPin } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef } from "react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const PropertyLocation = ({ propertyId }: PropertyDetailsProps) => {
  const { data: property, isError, isLoading } = useGetPropertyQuery(propertyId);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!property || !mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/azqpbao/cmrgb8mmi005t01sic2wqgsfd",
      center: [property.location.coordinates.longitude, property.location.coordinates.latitude],
      zoom: 14,
    });

    new mapboxgl.Marker({ color: "#000000" })
      .setLngLat([property.location.coordinates.longitude, property.location.coordinates.latitude])
      .addTo(mapRef.current);

    const resizeTimer = setTimeout(() => mapRef.current?.resize(), 300);

    return () => {
      clearTimeout(resizeTimer);
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [property?.id]);

  if (isError || (!property && !isLoading)) {
    return <div className="py-16 text-center text-gray-500">Property location not available</div>;
  }

  return (
    <div className="py-16">
      <h3 className="text-xl font-semibold text-primary-800">Map and Location</h3>

      <div className="flex justify-between items-center text-sm text-primary-500 mt-2">
        {isLoading ? (
          <Skeleton className="h-4 w-64" />
        ) : (
          <div className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-1 text-gray-700" />
            Property Address:
            <span className="ml-2 font-semibold text-gray-700">
              {property?.location?.address || "Address not available"}
            </span>
          </div>
        )}

        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(
            property?.location?.address || "",
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-between items-center hover:underline gap-2 text-primary-600"
        >
          <Compass className="w-5 h-5" />
          Get Directions
        </a>
      </div>

      <div className="relative mt-4 h-75 rounded-lg overflow-hidden">
        <div className="w-full h-full" ref={mapContainerRef} />
        {isLoading && <Skeleton className="absolute inset-0 rounded-lg" />}
      </div>
    </div>
  );
};

export default PropertyLocation;
