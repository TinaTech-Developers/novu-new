"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function RoomsPage() {
  const router = useRouter();

  const rooms = [
    {
      name: "Two Bedroom Apartment",
      size: "45 sq. metres",
      desc: "Perfect for families or small groups, offering space, comfort, and modern amenities.",
      image: "/hero1.jpg",
      facilities: ["WiFi", "Kitchen", "Air Conditioning", "Smart TV"],
      link: "/accommodation/two-beds",
    },
    {
      name: "Three Bedroom Apartment",
      size: "65 sq. metres",
      desc: "Spacious living with multiple rooms, ideal for extended stays and group travel.",
      image: "/hero2.jpg",
      facilities: ["WiFi", "Full Kitchen", "Lounge Area", "Balcony"],
      link: "/accommodation/three-beds",
    },
    {
      name: "Executive Suite",
      size: "80 sq. metres",
      desc: "Luxury suite designed for premium comfort with elegant interiors and exclusive features.",
      image: "/hero1.jpg",
      facilities: ["King Bed", "Mini Bar", "Bathtub", "Workspace", "WiFi"],
      link: "/accommodation/executive",
    },
  ];

  return (
    <div className="bg-white">
      {/* ================= HERO ================= */}
      <section className="relative h-[55vh] flex items-center justify-center text-center">
        <img
          src="/hero1.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative text-white px-6 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold">Our Apartments</h1>
          <p className="mt-3 text-gray-200">
            Experience comfort, space, and luxury in every stay at Novu Resort
          </p>
        </div>
      </section>

      {/* ================= HIGHLIGHTS ================= */}
      <section className="max-w-6xl mx-auto px-6 md:px-20 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          "Spacious Apartments",
          "Modern Interiors",
          "Family Friendly",
          "Secure & Private",
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-2 h-2 bg-[var(--primary)] rounded-full" />
            <p className="text-gray-600 text-sm">{item}</p>
          </div>
        ))}
      </section>

      {/* ================= ROOM COMPARISON ================= */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-20">
          <h2 className="text-2xl font-bold text-[var(--primary)] mb-8">
            Compare Apartments
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-gray-600">Type</th>
                  <th className="py-3 text-gray-600">Size</th>
                  <th className="py-3 text-gray-600">Guests</th>
                  <th className="py-3 text-gray-600">Features</th>
                </tr>
              </thead>

              <tbody className="text-gray-600">
                <tr className="border-b border-t border-gray-600">
                  <td className="py-4">2 Bedroom</td>
                  <td>45 sqm</td>
                  <td>4 Guests</td>
                  <td>Kitchen, WiFi, TV, WiFi</td>
                </tr>

                <tr className="border-b">
                  <td className="py-4">3 Bedroom</td>
                  <td>65 sqm</td>
                  <td>6 Guests</td>
                  <td>Full Kitchen, Lounge, TV, WiFi</td>
                </tr>

                <tr>
                  <td className="py-4">Executive</td>
                  <td>80 sqm</td>
                  <td>2 Guests</td>
                  <td>Luxury Suite, Bathtub, TV, WiFi</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      {/* ================= AMENITIES ================= */}
      <section className="py-16 text-center">
        <h2 className="text-2xl font-bold text-[var(--primary)]">
          Included Amenities
        </h2>

        <div className="flex flex-wrap justify-center gap-6 mt-6 text-gray-600 text-sm">
          {[
            "Free WiFi",
            "Air Conditioning",
            "Smart TV",
            "Kitchen",
            "Laundry Service",
            "24/7 Support",
          ].map((item, i) => (
            <span key={i} className="border px-4 py-2 rounded-full">
              {item}
            </span>
          ))}
        </div>
      </section>
      {/* ================= POLICIES ================= */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-[var(--primary)]">
            Booking Information
          </h2>

          <p className="text-gray-600 mt-4">
            Check-in from 2:00 PM | Check-out before 11:00 AM
          </p>

          <p className="text-gray-600 mt-2">
            Free cancellation within 24 hours. Additional policies may apply.
          </p>
        </div>
      </section>

      {/* ================= ROOMS ================= */}
      <section className="max-w-7xl mx-auto px-6 md:px-20 py-20 flex flex-col gap-16">
        {rooms.map((room, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`flex flex-col md:flex-row gap-10 items-center ${
              i % 2 !== 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* IMAGE */}
            <div className="md:w-1/2">
              <img
                src={room.image}
                className="w-full h-[320px] object-cover rounded-3xl shadow-lg"
              />
            </div>

            {/* CONTENT */}
            <div className="md:w-1/2 flex flex-col gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--primary)]">
                {room.name}
              </h2>

              <p className="text-sm text-gray-500">{room.size}</p>

              <p className="text-gray-600 leading-relaxed">{room.desc}</p>

              {/* FACILITIES */}
              <div className="flex flex-wrap gap-2 mt-2">
                {room.facilities.map((f, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600"
                  >
                    {f}
                  </span>
                ))}
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => router.push(room.link)}
                  className="bg-[var(--primary)] text-white px-5 py-2 rounded-lg"
                >
                  Book Now
                </button>

                <button className="border px-5 py-2 rounded-lg">
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ================= CTA ================= */}
      {/* <section className="bg-gray-900 text-white text-center py-20 px-6">
        <h2 className="text-3xl">Find Your Perfect Stay</h2>
        <p className="text-gray-300 mt-3">
          Choose the apartment that suits your comfort and lifestyle
        </p>

        <button
          onClick={() => router.push("/rooms")}
          className="mt-6 bg-[var(--primary)] px-6 py-3 rounded-lg"
        >
          Book Now
        </button>
      </section> */}
    </div>
  );
}
