"use client";

import { useState } from "react";

import Navbar from "@/app/components/layout/Navbar";
import Sidebar from "@/app/components/layout/Sidebar";

import ProfileCard from "@/app/components/settings/ProfileCard";
import SecurityCard from "@/app/components/settings/SecurityCard";
import NotificationCard from "@/app/components/settings/NotificationCard";
import PaymentPreferenceCard from "@/app/components/settings/PaymentPreferenceCard";
import BankAccountCard from "@/app/components/settings/BankAccountCard";
import DangerZoneCard from "@/app/components/settings/DangerZoneCard";

import { Menu, X } from "lucide-react";

export default function SettingsPage() {
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
            className="
              fixed inset-0 z-40
              bg-black/40
              backdrop-blur-sm
              lg:hidden
            "
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
          {/* Header */}
          <div className="flex items-start gap-4">
            {/* Hamburger */}
            <button
              onClick={() =>
                setIsSidebarOpen(
                  (prev) => !prev
                )
              }
              className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-3
                shadow-sm
                transition
                hover:bg-slate-100
                lg:hidden
              "
            >
              {isSidebarOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>

            <div>
              <h1 className="text-3xl font-bold md:text-4xl">
                Settings ⚙️
              </h1>

              <p className="mt-2 text-sm text-slate-500 md:text-base">
                Manage your profile, security,
                and payment preferences.
              </p>
            </div>
          </div>

          {/* Settings Cards */}
          <div className="mt-10 space-y-8">
            <ProfileCard />

            <SecurityCard />

            <NotificationCard />

            <PaymentPreferenceCard />

            <BankAccountCard />

            <DangerZoneCard />
          </div>
        </main>
      </div>
    </>
  );
}