"use client";

import { CheckCircle, AlertCircle, WifiOff } from "lucide-react";
import { useEffect } from "react";

interface NotificationToastProps {
  message: string;
  type: "success" | "error" | "warning";
  onClose: () => void;
  duration?: number;
}

export default function NotificationToast({
  message,
  type,
  onClose,
  duration = 5000,
}: NotificationToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} />;
      case "warning":
        return <WifiOff size={20} />;
      case "error":
        return <AlertCircle size={20} />;
      default:
        return null;
    }
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-700 border border-green-300";
      case "warning":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "error":
        return "bg-red-100 text-red-700 border border-red-300";
      default:
        return "";
    }
  };

  return (
    <div
      className={`
        fixed top-20 right-4 z-50 max-w-md
        flex items-center gap-3
        rounded-2xl px-6 py-4
        shadow-lg transition-all duration-300
        ${getStyles()}
      `}
      role="alert"
    >
      {getIcon()}
      <span className="font-medium">{message}</span>
    </div>
  );
}