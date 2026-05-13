"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AdminLayout from "../_components/layout";

export default function SettingsPage() {
  const [tab, setTab] = useState("profile");

  // PROFILE
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // BUSINESS
  const [hotelName, setHotelName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // PRICING
  const [vat, setVat] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);

  // SECURITY
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // New USERS
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userRole, setUserRole] = useState("staff");

  const [creatingUser, setCreatingUser] = useState(false);

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "business", label: "Business" },
    { id: "pricing", label: "Pricing" },
    { id: "security", label: "Security" },
    { id: "users", label: "Users" },
  ];

  const handleCreateUser = async () => {
    try {
      if (!userName || !userEmail || !userPassword) {
        alert("Please complete required fields");
        return;
      }

      setCreatingUser(true);

      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          phone: userPhone,
          password: userPassword,
          role: userRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to create user");
        return;
      }

      alert("User created successfully");

      // RESET
      setUserName("");
      setUserEmail("");
      setUserPhone("");
      setUserPassword("");
      setUserRole("staff");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setCreatingUser(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your system configuration
          </p>
        </div>

        {/* TABS */}
        <div className="bg-white border rounded-2xl p-2 flex gap-2 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                tab === t.id ?
                  "bg-[var(--primary)] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border rounded-2xl p-6 shadow-sm"
        >
          {/* ================= PROFILE ================= */}
          {tab === "profile" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">Profile</h2>

              <input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />

              <input
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />

              <button className="bg-[var(--primary)] text-white px-5 py-2 rounded-xl">
                Save Profile
              </button>
            </div>
          )}

          {/* ================= BUSINESS ================= */}
          {tab === "business" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">
                Business Details
              </h2>

              <input
                placeholder="Hotel Name"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />

              <input
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />

              <textarea
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
                rows={3}
              />

              <button className="bg-[var(--primary)] text-white px-5 py-2 rounded-xl">
                Save Business Info
              </button>
            </div>
          )}

          {/* ================= PRICING ================= */}
          {tab === "pricing" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">
                Pricing Settings
              </h2>

              <input
                type="number"
                placeholder="VAT %"
                value={vat}
                onChange={(e) => setVat(Number(e.target.value))}
                className="w-full border rounded-xl px-4 py-3"
              />

              <input
                type="number"
                placeholder="Service Fee %"
                value={serviceFee}
                onChange={(e) => setServiceFee(Number(e.target.value))}
                className="w-full border rounded-xl px-4 py-3"
              />

              <button className="bg-[var(--primary)] text-white px-5 py-2 rounded-xl">
                Save Pricing
              </button>
            </div>
          )}

          {/* ================= SECURITY ================= */}
          {tab === "security" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">Security</h2>

              <input
                type="password"
                placeholder="Current Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />

              <button className="bg-red-500 text-white px-5 py-2 rounded-xl">
                Update Password
              </button>
            </div>
          )}
          {/* ================= USERS ================= */}
          {tab === "users" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Register New User
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Create admin or staff accounts for the system
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* FULL NAME */}
                <div>
                  <label className="text-sm text-gray-600 block mb-2">
                    Full Name
                  </label>

                  <input
                    placeholder="Enter full name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="text-sm text-gray-600 block mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label className="text-sm text-gray-600 block mb-2">
                    Phone Number
                  </label>

                  <input
                    placeholder="Enter phone number"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                {/* ROLE */}
                <div>
                  <label className="text-sm text-gray-600 block mb-2">
                    User Role
                  </label>

                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                    <option value="guest">Guest</option>
                  </select>
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm text-gray-600 block mb-2">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Enter password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              {/* BUTTON */}
              <div className="flex justify-end">
                <button
                  disabled={creatingUser}
                  onClick={handleCreateUser}
                  className="bg-[var(--primary)] text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition"
                >
                  {creatingUser ? "Creating User..." : "Create User"}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
}
