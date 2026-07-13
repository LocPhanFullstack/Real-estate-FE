import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppSelector } from "@/state/redux";
import { useGetPropertiesQuery } from "@/state/api";
import { property } from "lodash";
import { Property } from "@/types/prismaTypes";
import Loading from "@/components/Loading";
import { Spinner } from "@/components/ui/spinner";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const Map = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const filters = useAppSelector((state) => state.global.filters);

  const { data: properties, isLoading, isFetching, isError } = useGetPropertiesQuery(filters);

  const createPropertyMarker = (property: Property, map: mapboxgl.Map) => {
    const marker = new mapboxgl.Marker({ color: "#EF4444" })
      .setLngLat([property.location.coordinates.longitude, property.location.coordinates.latitude])
      .setPopup(
        new mapboxgl.Popup().setHTML(
          `
        <div class="marker-popup">
          <div class="marker-popup-image"></div>
          <div>
            <a href="/search/${property.id}" target="_blank" class="marker-popup-title">${property.name}</a>
            <p class="marker-popup-price">
              $${property.pricePerMonth}
              <span class="marker-popup-price-unit"> / month</span>
            </p>
          </div>
        </div>
      `,
        ),
      )
      .addTo(map);
    return marker;
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/azqpbao/cmrgb8mmi005t01sic2wqgsfd",
      center: filters.coordinates || [-74.5, 40],
      zoom: 9,
    });

    const resizeTimer = setTimeout(() => mapRef.current?.resize(), 500);

    return () => {
      clearTimeout(resizeTimer);
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []); // Only run when mount

  useEffect(() => {
    if (!mapRef.current || !properties) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = properties.map((property) =>
      createPropertyMarker(property, mapRef.current!),
    );
  }, [properties]); // Only update marker when properties changed, not effect to map instance

  useEffect(() => {
    if (!mapRef.current || !filters.coordinates) return;

    mapRef.current.flyTo({
      center: filters.coordinates,
      zoom: 9,
      essential: true,
    });
  }, [filters.coordinates]); // jump to new coordinates

  return (
    <div className="basis-5/12 grow relative rounded-xl">
      <div
        className="map-container rounded-xl"
        ref={mapContainerRef}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-xl z-10">
          <Loading text="" />
        </div>
      )}

      {!isLoading && isFetching && (
        <div className="absolute top-3 right-3 z-10 bg-white/90 rounded-full shadow-md p-2">
          <Spinner className="size-4 text-primary-700" />
        </div>
      )}

      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-xl">
          Failed to fetch properties
        </div>
      )}
    </div>
  );
};

export default Map;
