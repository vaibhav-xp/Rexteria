"use client";

import DisplayEnquirySection from "@/components/spanel/Dashboard/DisplayEnquirySection";
import DisplayModSection from "@/components/spanel/Dashboard/DisplayModSection";
import ReviewSection from "@/components/spanel/Dashboard/DisplayReviews";
import Title from "@/components/ui/title";
import { getDashboardFn } from "@/services/dashboard";
import { DashboardTypes } from "@/types/dashboard-types";
import {
  CarIcon,
  ChartBarStacked,
  ImageIcon,
  User2Icon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import React, { ReactElement, ReactNode, useEffect, useState } from "react";

export default function Spanel() {
  const [dashboard, setDashboard] = useState<DashboardTypes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardFn()
      .then((data) => setDashboard(data?.data))
      .then(() => setLoading(false));
  }, []);

  if (!dashboard) {
    return <p className="text-center mt-8 text-xl">Loading...</p>;
  }

  return (
    <div className="p-6">
      <Title title="Dashboard" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-4">
        {/* Active Users */}
        <Link href="/spanel/users">
          <Card
            icon={<User2Icon />}
            count={dashboard?.activeUsers}
            title="Active Users"
          />
        </Link>

        {/* Total Categories */}
        <Link href="/spanel/category">
          <Card
            icon={<ChartBarStacked />}
            count={dashboard?.totalCategories}
            title="Total Categories"
          />
        </Link>

        {/* Active Mods */}
        <Link href="/spanel/mods">
          <Card
            icon={<CarIcon />}
            count={dashboard?.activeMods}
            title="Active Mods"
          />
        </Link>

        {/* Total Mods */}
        <Link href="/spanel/mods">
          <Card
            icon={<UsersIcon />}
            count={dashboard?.totalMods}
            title="Total Mods"
          />
        </Link>

        {/* Total Gallery Images */}
        <Link href="/spanel/gallery">
          <Card
            icon={<ImageIcon />}
            count={dashboard?.totalGalleryImage}
            title="Gallery Images"
          />
        </Link>
      </div>

      {/* Top 5 Mods by Rating */}
      <DisplayModSection
        title="Top 5 Mods by Rating"
        items={dashboard?.top5ModsByRating}
      />

      {/* Top 5 Mods by Views */}
      <DisplayModSection
        title="Top 5 Mods by Views"
        items={dashboard?.top5ModsByViews}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Reviews */}
        <ReviewSection
          title="Recent Reviews"
          items={dashboard?.recentReviews}
        />

        <DisplayEnquirySection
          title="Review Enquiries"
          items={dashboard?.recentEnquiry}
        />
      </div>
    </div>
  );
}

interface CardProps {
  icon: ReactElement;
  count: number;
  title: string;
}

function Card({ icon, count, title }: CardProps) {
  return (
    <div className="bg-card rounded-lg transition-transform duration-200 hover:scale-105 p-4 space-y-2 flex flex-col items-center shadow-md">
      {React.cloneElement(icon, {
        size: 50,
        className: "bg-primary rounded-full p-2 text-white",
      })}
      <p className="text-3xl font-bold">{count}</p>
      <h3 className="text-lg font-semibold text-center">{title}</h3>
    </div>
  );
}
