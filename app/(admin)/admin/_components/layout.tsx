"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

  const [user, setUser] = useState<any>(null);

  // ================= FETCH LOGGED USER =================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users/me");

        if (!res.ok) {
          router.push("/admin");
          return;
        }

        const data = await res.json();

        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [router]);

  // ================= SIGN OUT =================
  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    localStorage.removeItem("user");

    router.push("/admin/login");
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
                  flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all

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
          <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-[var(--primary)]/90 via-[var(--primary)] to-black text-white shadow-xl">
            {/* Animated blobs */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />

            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-300/10 rounded-full blur-3xl animate-pulse delay-1000" />

            {/* Moving gradient overlay */}
            <div className="absolute inset-0 opacity-20 bg-[length:200%_200%] animate-[gradientMove_8s_ease_infinite] bg-gradient-to-r from-transparent via-white to-transparent" />

            {/* Content */}
            <div className="relative z-10">
              <p className="text-xs text-white/70">Logged in as</p>

              <h3 className="font-bold text-lg mt-1 truncate">
                {user?.name || user?.username || "Administrator"}
              </h3>

              <p className="text-xs text-white/80 mt-1 truncate">
                {user?.email}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-white/60">Hotel ERP v1.0</p>

                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-ping absolute" />

                  <span className="w-2 h-2 rounded-full bg-green-400 relative" />

                  <span className="text-[10px] text-white/70 ml-2">ONLINE</span>
                </div>
              </div>
            </div>
          </div>
          {/* SIGN OUT BUTTON */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 text-sm font-medium transition"
          >
            <LogOut size={18} />

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
