"use client";

import { LogOut, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const menu = [
  { name: "Dashboard", href: "/admin/dashboard", icon: "📊" },
  { name: "Bookings", href: "/admin/bookings", icon: "📅" },
  { name: "Rooms", href: "/admin/rooms", icon: "🛏️" },
  { name: "Guests", href: "/admin/guests", icon: "👤" },
  { name: "Payments", href: "/admin/payments", icon: "💰" },
  { name: "Analytics", href: "/admin/analytics", icon: "📈" },
  { name: "Settings", href: "/admin/settings", icon: "⚙️" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // ================= SIGN OUT =================
  const handleLogout = async () => {
    const confirmed = confirm("Are you sure you want to sign out?");

    if (!confirmed) return;

    // OPTIONAL:
    // Clear localStorage/sessionStorage if needed
    localStorage.removeItem("token");
    sessionStorage.clear();

    // Redirect to login page
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= SIDEBAR ================= */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r z-50 flex flex-col shadow-sm">
        {/* LOGO */}
        <div className="px-6 py-6 border-b">
          <h1 className="text-2xl font-black text-[var(--primary)] tracking-tight">
            Hotel ERP
          </h1>

          <p className="text-xs text-gray-500 mt-1">Management Dashboard</p>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menu.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3  text-sm font-medium transition-all

                  ${
                    active ?
                      "bg-[var(--primary)] text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>

                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t space-y-3">
          <div className="bg-gray-100 rounded-2xl p-4">
            <p className="text-xs text-gray-500">Logged in as</p>

            <h3 className="font-semibold text-gray-800 mt-1">Administrator</h3>

            <p className="text-xs text-gray-400 mt-2">Hotel ERP v1.0</p>
          </div>

          {/* SIGN OUT BUTTON */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 text-sm font-medium transition"
          >
            <LogOut />
            {/* <span>🚪</span> */}
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="ml-64 min-h-screen p-6 lg:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
