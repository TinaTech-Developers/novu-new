"use client";

import Link from "next/link";

const menu = [
  { name: "Dashboard", href: "/admin", icon: "📊" },
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
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r p-6 flex flex-col">
        <h1 className="text-xl font-bold text-[var(--primary)] mb-8">
          Hotel ERP
        </h1>

        <nav className="flex flex-col gap-1 text-sm">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto text-xs text-gray-400">v1.0 ERP System</div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
