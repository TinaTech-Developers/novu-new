"use client";

import { useState } from "react";

export default function GalleryPage() {
  const categories = ["All", "Rooms", "Dining", "Facilities", "Events"];

  const images = [
    { src: "/hero1.jpg", category: "Rooms", desc: "Luxury room interior" },
    { src: "/hero2.jpg", category: "Dining", desc: "Fine dining experience" },
    { src: "/hero1.jpg", category: "Facilities", desc: "Swimming pool area" },
    { src: "/hero2.jpg", category: "Events", desc: "Conference setup" },
    { src: "/hero1.jpg", category: "Rooms", desc: "Executive suite" },
    { src: "/hero2.jpg", category: "Dining", desc: "Restaurant ambiance" },
    { src: "/hero1.jpg", category: "Facilities", desc: "Outdoor lounge" },
    { src: "/hero2.jpg", category: "Events", desc: "Wedding setup" },
  ];

  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState<any>(null);

  const filtered =
    active === "All" ? images : images.filter((img) => img.category === active);

  return (
    <div className="bg-white">
      {/* ================= HERO ================= */}
      <section className="relative h-[70vh] flex items-center justify-center text-center">
        <img
          src="/hero1.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative text-white px-6">
          <h1 className="text-4xl md:text-5xl ">Gallery</h1>
          <p className="mt-3 text-gray-200">
            Explore moments from our resort experience
          </p>
        </div>
      </section>

      {/* ================= FILTER ================= */}
      <section className="max-w-6xl mx-auto px-6 md:px-20 py-10 flex justify-center gap-4 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-2 rounded-full text-sm transition ${
              active === cat ?
                "bg-[var(--primary)] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* ================= GALLERY ================= */}
      <section className="max-w-7xl mx-auto px-6 md:px-20 pb-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((img, i) => (
          <div key={i} className="relative group overflow-hidden rounded-2xl">
            <img
              src={img.src}
              className="w-full h-[260px] object-cover group-hover:scale-110 transition duration-500"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <button
                onClick={() => setSelected(img)}
                className="text-white text-sm border px-4 py-2 rounded-full"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="fixed inset-0 bg-black/100 flex items-center justify-center z-50 px-6">
          {/* CLOSE */}
          <button
            onClick={() => setSelected(null)}
            className="absolute top-6 right-6 text-white text-2xl bg-red-600 p-4 rounded-full hover:bg-red-700 transition"
          >
            ✕
          </button>

          {/* CONTENT */}
          <div className="max-w-4xl w-full">
            <img
              src={selected.src}
              className="w-full max-h-[70vh] object-cover rounded-xl"
            />

            <p className="text-white mt-4 text-center">{selected.desc}</p>
          </div>
        </div>
      )}

      {/* ================= CTA ================= */}
      <section className="bg-gray-900 text-white text-center py-16 px-6">
        <h2 className="text-3xl font-bold">Experience It Yourself</h2>
        <p className="text-gray-300 mt-3">
          Book your stay and create your own unforgettable moments
        </p>

        <button className="mt-6 bg-[var(--primary)] px-6 py-3 rounded-lg">
          Book Now
        </button>
      </section>
    </div>
  );
}
