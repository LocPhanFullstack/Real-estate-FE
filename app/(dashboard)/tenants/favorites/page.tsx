"use client";

import Card, { CardSkeleton } from "@/components/Card";
import Header from "@/components/Header";
import { useGetAuthUserQuery, useGetPropertiesQuery, useGetTenantQuery } from "@/state/api";
import React from "react";

const Favorites = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const { data: tenant } = useGetTenantQuery(undefined, { skip: !authUser });

  const {
    data: favoriteProperties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(
    {
      favoriteIds: tenant?.favorites?.map((fav: { id: number }) => fav.id),
    },
    { skip: !tenant?.favorites || tenant?.favorites.length === 0 },
  );

  if (isError) return <div>Error to fetch favorite properties</div>;

  return (
    <div className="dashboard-container">
      <Header
        title="Favorited Properties"
        subtitle="Browse and manage your saved property listings"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => <CardSkeleton key={index} />)
          : favoriteProperties?.map((property) => (
              <Card
                key={property.id}
                property={property}
                isFavorite={true}
                onFavoriteToggle={() => {}}
                showFavoriteButton={false}
                propertyLink={`/tenants/residences/${property.id}`}
              />
            ))}
      </div>
      {!isLoading && (!favoriteProperties || favoriteProperties.length === 0) && (
        <p>You don&lsquo;t have any favorited properties</p>
      )}
    </div>
  );
};

export default Favorites;
