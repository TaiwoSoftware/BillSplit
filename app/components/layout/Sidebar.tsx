"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Receipt,
  Settings,
  LogOut,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  isOpen = false,
  onClose,
}: SidebarProps) {
  return (
    <aside
      className={`
        fixed left-0 top-0 z-50 h-screen w-72
        border-r border-slate-200 bg-white
        transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-6">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="
              flex items-center gap-3 rounded-xl p-4
              text-slate-700 transition
              hover:bg-slate-100 hover:text-slate-900
            "
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/bills"
            onClick={onClose}
            className="
              flex items-center gap-3 rounded-xl p-4
              text-slate-700 transition
              hover:bg-slate-100 hover:text-slate-900
            "
          >
            <Receipt size={20} />
            <span>Bills</span>
          </Link>

          <Link
            href="/settings"
            onClick={onClose}
            className="
              flex items-center gap-3 rounded-xl p-4
              text-slate-700 transition
              hover:bg-slate-100 hover:text-slate-900
            "
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>

        {/* Footer */}
        <div className="border-t p-6">
          <button
            className="
              flex w-full items-center gap-3 rounded-xl p-4
              text-red-600 transition
              hover:bg-red-50
            "
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}