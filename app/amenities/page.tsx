"use client";

import { motion } from "framer-motion";
import AmenitiesFAQ from "./components/amenitiesfaq";

export default function AmenitiesPage() {
  const features = [
    {
      title: "Swimming Pool",
      desc: "Luxury infinity-style relaxation pool experience.",
      image: "/hero1.jpg",
    },
    {
      title: "Quad Biking",
      desc: "Off-road adventure through scenic landscapes.",
      image: "/hero2.jpg",
    },
    {
      title: "Conference Hall",
      desc: "Modern corporate event & meeting facilities.",
      image: "/hero1.jpg",
    },
    {
      title: "Fine Dining",
      desc: "Premium culinary experience by expert chefs.",
      image: "/hero2.jpg",
    },
  ];

  const amenities = [
    "Free WiFi",
    "Secure Parking",
    "Room Service",
    "Air Conditioning",
    "Airport Pickup",
    "24/7 Reception",
    "Laundry Service",
    "Outdoor Lounge",
  ];

  return (
    <div className="bg-white">
      {/* ================= HERO ================= */}
      <section className="relative h-[55vh] flex items-center justify-center">
        <img
          src="/hero1.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative text-center text-white max-w-3xl px-6">
          <h1 className="text-5xl ">Luxury Resort Amenities</h1>
          <p className="mt-4 text-gray-200 text-lg">
            Designed for comfort, adventure, and unforgettable experiences.
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        {/* HEADER */}
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl  text-[var(--primary)]">Resort Amenities</h2>
          <p className="text-gray-500 mt-3">
            Everything thoughtfully designed for comfort, convenience, and
            relaxation.
          </p>
        </div>

        {/* HERO IMAGE */}
        <div className="max-w-6xl mx-auto px-6 md:px-20 mt-12">
          <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-xl">
            <img
              src="/hero1.jpg"
              className="w-full h-full object-cover"
              alt="Resort"
            />
            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-3xl ">Experience Pure Comfort</h3>
              <p className="text-gray-200 mt-1">
                Luxury living blended with nature and modern convenience
              </p>
            </div>
          </div>
        </div>

        {/* FEATURES LIST (THIS IS THE KEY PART) */}
        <div className="w-full mx-auto mt-16 px-6">
          <AmenitiesFAQ />
          {/* </div> */}
        </div>
      </section>
      {/* ================= ICON AMENITIES GRID ================= */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-20 text-center">
          <h2 className="text-3xl font-bold text-[var(--primary)]">
            Hotel Facilities
          </h2>
          <p className="text-gray-500 mt-2">
            Everything you need for a perfect stay
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            {amenities.map((item, i) => (
              <div
                key={i}
                className="bg-white shadow-sm rounded-2xl py-6 px-4 hover:shadow-md transition"
              >
                <div className="text-[var(--primary)] text-sm font-semibold">
                  {item}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="text-center py-20 bg-gray-900 text-white">
        <h2 className="text-3xl font-bold">Experience Novu Resort Today</h2>
        <p className="text-gray-300 mt-3">
          Book your stay and enjoy world-class hospitality.
        </p>

        <button className="mt-6 bg-[var(--primary)] px-6 py-3 rounded-lg">
          Book Now
        </button>
      </section>
    </div>
  );
}
