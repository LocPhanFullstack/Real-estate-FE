"use client";

import Card, { CardSkeleton } from "@/components/Card";
import Header from "@/components/Header";
import { useGetAuthUserQuery, useGetCurrentResidencesQuery, useGetTenantQuery } from "@/state/api";
import React from "react";

const ResidencesPage = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const { data: tenant } = useGetTenantQuery(undefined, { skip: !authUser });

  const {
    data: currentResidences,
    isLoading,
    isError,
  } = useGetCurrentResidencesQuery(undefined, { skip: !authUser });

  if (isLoading) return <div>Loading</div>;
  if (isError) return <div>Error</div>;

  return (
    <div className="dashboard-container">
      <Header title="Current Residences" subtitle="View and manage your current living spaces" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => <CardSkeleton key={index} />)
          : currentResidences?.map((item) => (
              <Card
                key={item.id}
                property={item}
                isFavorite={true}
                onFavoriteToggle={() => {}}
                showFavoriteButton={false}
                propertyLink={`/tenants/residences/${item.id}`}
              />
            ))}
      </div>
      {!isLoading && (!currentResidences || currentResidences.length === 0) && (
        <p>You don&lsquo;t have any current residences</p>
      )}
    </div>
  );
};

export default ResidencesPage;
