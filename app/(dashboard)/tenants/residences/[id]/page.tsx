"use client";

import Loading from "@/components/Loading";
import {
  useGetAuthUserQuery,
  useGetLeasePaymentsQuery,
  useGetLeasesQuery,
  useGetPropertyQuery,
} from "@/state/api";
import { useParams } from "next/navigation";
import React from "react";
import ResidenceCard from "./components/ResidenceCard";
import PaymentMethod from "./components/PaymentMethod";
import BillingHistory from "./components/BillingHistory";

const Residence = () => {
  const { id } = useParams();
  const { data: authUser } = useGetAuthUserQuery();
  const {
    data: property,
    isLoading: propertyLoading,
    isError: propertyError,
  } = useGetPropertyQuery(Number(id));

  const { data: leases, isLoading: leasesLoading } = useGetLeasesQuery(undefined, {
    skip: !authUser,
  });

  const { data: payments, isLoading: paymentsLoading } = useGetLeasePaymentsQuery(
    leases?.[0]?.id || 0,
    {
      skip: !leases?.[0]?.id,
    },
  );

  if (propertyLoading || leasesLoading || paymentsLoading) return <Loading />;
  if (!property || propertyError) return <div>Error loading property</div>;

  const currentLease = leases?.find((lease) => lease.propertyId === property.id);

  return (
    <div className="dashboard-container">
      <div className="w-full mx-auto">
        <div className="md:flex gap-10">
          {currentLease && <ResidenceCard property={property} currentLease={currentLease} />}
          <PaymentMethod />
        </div>
        <BillingHistory payments={payments || []} />
      </div>
    </div>
  );
};

export default Residence;
