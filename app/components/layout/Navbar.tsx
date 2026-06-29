import Link from "next/link";
import { Bell, UserCircle } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600"
        >
          BillSplit 💸
        </Link>

        <div className="flex items-center gap-6">
          <button>
            <Bell size={22} />
          </button>

          <Link href={"/profile"}>
          <button>
            <UserCircle size={32} />
          </button>
          </Link>
        </div>
      </nav>
    </header>
  );
}