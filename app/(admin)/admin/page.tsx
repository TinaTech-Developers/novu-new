"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // store token (simple version)
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/admin/dashboard");
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE (branding) */}
      <div className="hidden lg:flex w-1/2 bg-[var(--primary)] text-white items-center justify-center p-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md"
        >
          <h1 className="text-4xl font-bold">Novu Resort Management System</h1>

          <p className="mt-4 text-white/80">
            Manage rooms, bookings, guests, and revenue in one powerful system.
          </p>

          <div className="mt-10 space-y-2 text-white/80 text-sm">
            <p>✔ Real-time bookings</p>
            <p>✔ Walk-in management</p>
            <p>✔ Admin dashboard</p>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE (form) */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white border rounded-2xl p-8 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back 👋</h2>

          <p className="text-sm text-gray-500 mt-1">
            Sign in to access your dashboard
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="admin@hotel.com"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="••••••••"
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--primary)] text-white py-3 rounded-xl font-medium hover:opacity-90 transition"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            {/* FOOTER */}
            <p className="text-xs text-gray-400 text-center mt-4">
              Secure admin access only
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
