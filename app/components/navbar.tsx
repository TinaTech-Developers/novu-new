"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-md"
    >
      <Image
        src="/logo.webp"
        alt="Novu Resort Logo"
        width={60}
        height={60}
        className="rounded-full"
      />
      {/* <h1 className="text-xl font-bold text-[var(--primary)]">Novu Resort</h1> */}

      <div className="hidden md:flex gap-6 text-gray-700">
        <Link href="/">Home</Link>
        <Link href="/rooms">Accommodation</Link>
        <Link href="/amenities">Amenities</Link>
        <Link href="/gallery">Gallery</Link>
        <Link href="/contact">Contact</Link>
      </div>

      <motion.button
        onClick={() => router.push("/rooms")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="bg-(--accent) text-white px-4 py-2 rounded-xl"
      >
        Book Now
      </motion.button>
    </motion.nav>
  );
}
