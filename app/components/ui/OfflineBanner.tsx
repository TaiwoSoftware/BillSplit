"use client";

import { WifiOff } from "lucide-react";

interface OfflineBannerProps {
  isOnline: boolean;
}

export default function OfflineBanner({ isOnline }: OfflineBannerProps) {
  if (isOnline) return null;

  return (
    <div className="mt-4 rounded-xl bg-yellow-100 p-3 text-sm text-yellow-700 border border-yellow-300">
      <WifiOff size={16} className="inline mr-2" />
      You are currently offline. Please check your internet connection.
    </div>
  );
}