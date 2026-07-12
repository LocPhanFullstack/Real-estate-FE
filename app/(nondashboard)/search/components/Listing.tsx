import Card, { CardSkeleton } from "@/components/Card";
import CardCompact, { CardCompactSkeleton } from "@/components/CardCompact";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddFavoritePropertyMutation,
  useGetAuthUserQuery,
  useGetPropertiesQuery,
  useGetTenantQuery,
  useRemoveFavoritePropertyMutation,
} from "@/state/api";
import { useAppSelector } from "@/state/redux";
import { Property } from "@/types/prismaTypes";

const Listing = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const { data: tenant } = useGetTenantQuery(authUser?.cognitoInfo?.userId || "", {
    skip: !authUser?.cognitoInfo?.userId,
  });
  const [addFavorite] = useAddFavoritePropertyMutation();
  const [removeFavorite] = useRemoveFavoritePropertyMutation();
  const viewMode = useAppSelector((state) => state.global.viewMode);
  const filters = useAppSelector((state) => state.global.filters);

  const { data: properties, isLoading, isFetching, isError } = useGetPropertiesQuery(filters);

  const handleFavoriteToggle = async (propertyId: number) => {
    if (!authUser) return;

    const isFavorite = tenant?.favorites?.some((fav: Property) => fav.id === propertyId) || false;

    if (isFavorite) {
      await removeFavorite({ cognitoId: tenant.cognitoId, propertyId });
    } else {
      await addFavorite({ cognitoId: tenant.cognitoId, propertyId });
    }
  };

  if (isError || (!properties && !isLoading)) return <div>Failed to fetch properties</div>;

  return (
    <div className="w-full">
      <h3 className="text-sm px-4 font-bold">
        {isLoading ? (
          <Skeleton className="h-4 w-32 inline-block" />
        ) : (
          <>
            {properties?.length}{" "}
            <span className="text-gray-700 font-normal">Place in {filters.location}</span>
          </>
        )}
      </h3>
      {isFetching && !isLoading && (
        <div className="h-0.5 mx-4 bg-primary-200 overflow-hidden rounded-full relative">
          <div className="absolute inset-y-0 w-1/3 bg-primary-700 rounded-full animate-[loading-bar_1s_ease-in-out_infinite]" />
        </div>
      )}
      <div className="flex">
        <div className="p-4 w-full">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) =>
              viewMode === "grid" ? <CardSkeleton key={i} /> : <CardCompactSkeleton key={i} />,
            )}

          {!isLoading &&
            properties?.map((property) =>
              viewMode === "grid" ? (
                <Card
                  key={property.id}
                  property={property}
                  isFavorite={
                    tenant?.favorites?.some((fav: Property) => fav.id === property.id) || false
                  }
                  onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                  showFavoriteButton={!!authUser}
                  propertyLink={`/search/${property.id}`}
                />
              ) : (
                <CardCompact
                  key={property.id}
                  property={property}
                  isFavorite={
                    tenant?.favorites?.some((fav: Property) => fav.id === property.id) || false
                  }
                  onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                  showFavoriteButton={!!authUser}
                  propertyLink={`/search/${property.id}`}
                />
              ),
            )}
        </div>
      </div>
    </div>
  );
};

export default Listing;
