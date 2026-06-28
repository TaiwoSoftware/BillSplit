"use client";

import { useState } from "react";

import Navbar from "@/app/components/layout/Navbar";
import Sidebar from "@/app/components/layout/Sidebar";

import ProfileHeader from "@/app/components/profile/ProfileHeader";
import AccountStatistics from "@/app/components/profile/AccountStatistics";
import NotificationCard from "@/app/components/settings/NotificationCard";
import SecuritySection from "../components/profile/SecuritySection";
import RecentActivity from "../components/profile/RecentActivity";
import RecentBills from "../components/profile/RecentBills";
import Preferences from "../components/profile/Preferences";
import ExportData from "../components/profile/ExportData";
import DangerZone from "../components/profile/DangerZone";

export default function ProfilePage() {
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  return (
    <>
      <Navbar />

      <div className="relative flex min-h-[calc(100vh-80px)] bg-slate-50">
        {/* Overlay */}
        {isSidebarOpen && (
          <div
            onClick={() =>
              setIsSidebarOpen(false)
            }
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() =>
            setIsSidebarOpen(false)
          }
        />

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden p-5 md:p-8 lg:p-10">
            <Sidebar />
          <ProfileHeader />

          <AccountStatistics />

          <NotificationCard />

          <SecuritySection />

          <RecentActivity />

          <RecentBills />

          <Preferences />

          <ExportData />

          <DangerZone />
        </main>
      </div>
    </>
  );
}