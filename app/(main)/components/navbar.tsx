"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Accommodation", href: "/rooms" },
    { name: "Amenities", href: "/amenities" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="
  fixed top-0 left-0 w-full
  flex items-center justify-between
  px-4 md:px-6 py-4
  bg-white backdrop-blur-md
  shadow-md
  z-50
"
      >
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo.webp"
            alt="Novu Resort Logo"
            width={70}
            height={70}
            className=""
          />
          <span className="font-semibold text-[var(--primary)] hidden sm:block">
            Novu Resort
          </span>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-6 text-gray-700">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="hover:text-black transition"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* BOOK NOW (DESKTOP ONLY) */}
        <motion.button
          onClick={() => router.push("/rooms")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:block bg-[var(--primary)] text-white px-4 py-2 rounded-xl"
        >
          Book Now
        </motion.button>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl text-gray-700"
        >
          {open ? "✕" : "☰"}
        </button>
      </motion.nav>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {open && (
          <>
            {/* OVERLAY */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 z-40"
            />

            {/* MENU PANEL */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-[75%] max-w-sm bg-white z-50 shadow-xl p-6 flex flex-col gap-6"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg text-[var(--primary)]">
                  Menu
                </h2>
                <button onClick={() => setOpen(false)} className="text-xl">
                  ✕
                </button>
              </div>

              {/* LINKS */}
              <div className="flex flex-col gap-5 text-gray-700">
                {navLinks.map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-lg border-b pb-2"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* BOOK NOW (MOBILE) */}
              <button
                onClick={() => {
                  router.push("/rooms");
                  setOpen(false);
                }}
                className="mt-auto bg-[var(--primary)] text-white py-3 rounded-lg"
              >
                Book Now
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
