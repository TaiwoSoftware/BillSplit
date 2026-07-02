"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

import Link from "next/link";
import {
  LayoutDashboard,
  Receipt,
  Settings,
  LogOut,
  X,
  UserCircle,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navLinks = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: UserCircle,
  },
  {
    href: "/bills",
    label: "Bills",
    icon: Receipt,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];


const handleLogout = async () => {
  const router = useRouter();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout failed:", error.message);
    return;
  }

  router.push("/login"); // or "/" depending on your app
  router.refresh();
};

export default function Sidebar({
  isOpen = false,
  onClose,
}: SidebarProps) {
  return (
    <aside
      className={`
    fixed top-0 left-0 z-50
    h-screen w-[280px]
    overflow-y-auto
    border-r border-slate-200
    bg-white shadow-xl
    transition-transform duration-300 ease-in-out
    lg:static lg:h-auto lg:w-72
    lg:translate-x-0 lg:shadow-none
    ${isOpen
          ? "translate-x-0"
          : "-translate-x-full"
        }
  `}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-2xl font-bold text-blue-600">
            Welcome! 👋
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-slate-100 lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {navLinks.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="
                  flex items-center gap-3
                  rounded-xl px-4 py-3
                  text-slate-700
                  transition-all
                  hover:bg-blue-50
                  hover:text-blue-600
                "
              >
                <Icon size={20} />
                <span className="font-medium">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <button
            onClick={handleLogout}
            className="
    flex w-full items-center gap-3
    rounded-xl px-4 py-3
    text-red-600
    transition-all
    hover:bg-red-50
  "
          >

            <LogOut size={20} />
            <span className="font-medium">
              Logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}