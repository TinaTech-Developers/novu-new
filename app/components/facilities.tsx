"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type TabType =
  | "Accommodation"
  | "Dining"
  | "Facilities"
  | "Conferences"
  | "Gallery";

const tabs: TabType[] = [
  "Accommodation",
  "Dining",
  "Facilities",
  "Conferences",
  "Gallery",
];

// ✅ ROOMS
const accommodationCategories = [
  {
    title: "Two Beds Apartments",
    description:
      "Comfortable and modern two-bed apartments designed for couples, friends, or small families.",
    image: "/hero1.jpg",
    link: "/accommodation/two-beds",
  },
  {
    title: "Three Beds Apartments",
    description:
      "Spacious three-bed apartments ideal for families or group stays with full comfort and privacy.",
    image: "/hero2.jpg",
    link: "/accommodation/three-beds",
  },
  {
    title: "Executive Suites",
    description:
      "Luxury executive suites with premium finishes, lounge space, and high-end comfort.",
    image: "/hero1.jpg",
    link: "/accommodation/executive",
  },
];

const conferenceCategory = {
  title: "Conference Hall",
  description:
    "Fully equipped conference facilities ideal for meetings, events, and corporate functions.",
  image: "/IMG_9076.JPG",
  link: "/conferences/hall",
};
const content: Record<TabType, { title: string; text: string; image: string }> =
  {
    Accommodation: {
      title: "Warm African Hospitality",
      text: "Set in tranquil surroundings on the outskirts of the country's dynamic capital is the beautiful Novu Resort. The hotel blends modern styling with comfort and luxury, offering a perfect environment where business and pleasure meet in harmony.",
      image: "/hero1.jpg",
    },
    Dining: {
      title: "Fine Dining",
      text: "Experience world-class meals prepared by top chefs.",
      image: "/hero2.jpg",
    },
    Facilities: {
      title: "Facilities at a Glance",
      text: "Our resort offers a gym, pool, and relaxing outdoor spaces.",
      image: "/hero1.jpg",
    },
    Conferences: {
      title: "Conference Rooms",
      text: "Perfect venues for meetings and corporate events.",
      image: "/hero2.jpg",
    },
    Gallery: {
      title: "Explore Our Resort",
      text: "Take a visual tour of our beautiful resort.",
      image: "/hero1.jpg",
    },
  };

export default function Facilities() {
  const [active, setActive] = useState<TabType>("Accommodation");

  return (
    <section className="py-16 px-6 md:px-20 bg-white flex flex-col gap-14">
      {/* ================= TABS ================= */}
      <div className="flex gap-6 border-b overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className="relative pb-3 text-gray-600  tracking-wide"
          >
            {tab}

            {active === tab && (
              <motion.div
                layoutId="underline"
                className="absolute left-0 bottom-0 w-full h-[2px] bg-[var(--primary)]"
              />
            )}
          </button>
        ))}
      </div>

      {/* ================= TAB CONTENT ================= */}
      <div className="flex flex-col md:flex-row gap-10 items-center">
        <motion.div
          key={active}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1"
        >
          <h2 className="text-3xl md:text-4xl text-[var(--primary)] mb-4">
            {content[active].title}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {content[active].text}
          </p>
        </motion.div>

        <motion.div
          key={content[active].image}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1"
        >
          <img
            src={content[active].image}
            alt={active}
            className="shadow-lg w-full h-[350px] object-cover rounded-2xl"
          />
        </motion.div>
      </div>

      {/* ================= ACCOMMODATION CATEGORIES ================= */}
      {active === "Accommodation" && (
        <div className="flex flex-col gap-10">
          <h3 className="text-2xl font-semibold text-gray-800">
            Accommodation Options
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {accommodationCategories.map((item, index) => (
              <motion.a
                key={index}
                href={item.link}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="rounded-2xl overflow-hidden shadow-lg bg-white flex flex-col hover:scale-[1.02] transition"
              >
                {/* IMAGE */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-[220px] w-full object-cover"
                />

                {/* CONTENT */}
                <div className="p-5 flex flex-col gap-3">
                  <h4 className="text-xl font-bold text-[var(--primary)]">
                    {item.title}
                  </h4>

                  <p className="text-gray-600 text-sm">{item.description}</p>

                  <button className="mt-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg">
                    View Details
                  </button>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      )}

      {active === "Conferences" && (
        <div className="flex flex-col gap-12">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h3 className="text-4xl  text-[var(--primary)]">
              Conference & Events
            </h3>
            <p className="text-gray-500 mt-3">
              A premium venue designed for corporate meetings, workshops,
              weddings, and private functions with world-class service and
              modern facilities.
            </p>
          </motion.div>

          {/* MAIN GRID LAYOUT (NEW STRUCTURE) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {/* LEFT FEATURE PANEL */}
            <div className="md:col-span-2 relative rounded-3xl overflow-hidden shadow-lg h-[420px] group">
              <img
                src={conferenceCategory.image}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                alt="Conference Hall"
              />

              {/* LAYER OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

              {/* TEXT ON IMAGE */}
              <div className="absolute bottom-6 left-6 text-white max-w-md">
                <h2 className="text-3xl font-bold">
                  {conferenceCategory.title}
                </h2>
                <p className="text-sm text-gray-200 mt-2">
                  {conferenceCategory.description}
                </p>

                <button className="mt-4 bg-white text-[var(--primary)] px-5 py-2 rounded-lg font-medium">
                  Book Conference
                </button>
              </div>
            </div>

            {/* RIGHT SIDE INFO STACK */}
            <div className="flex flex-col gap-4">
              {[
                {
                  title: "Capacity",
                  value: "Up to 200 Guests",
                },
                {
                  title: "Layout Options",
                  value: "U-Shape, Theatre, Boardroom",
                },
                {
                  title: "Technology",
                  value: "Projectors, LED Screens, WiFi",
                },
                {
                  title: "Support",
                  value: "Event Planning & Catering",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white shadow-md border hover:shadow-lg transition"
                >
                  <p className="text-sm text-gray-500">{item.title}</p>
                  <p className="font-semibold text-gray-800">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* BOTTOM FEATURE STRIP */}
          <div className="grid md:grid-cols-4 gap-4">
            {[
              "High-Speed Internet",
              "Climate Controlled",
              "Audio System",
              "On-site Catering",
            ].map((feature, i) => (
              <div
                key={i}
                className="text-center p-4 rounded-xl bg-gray-50 border text-gray-600 text-sm"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      )}
      {active === "Facilities" && (
        <div className="flex flex-col gap-10">
          {/* HEADER */}
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-4xl font- text-[var(--primary)]">
              Resort Facilities & Activities
            </h3>
            <p className="text-gray-500 mt-3">
              Explore swimming, adventure, relaxation, and outdoor experiences
              designed for all guests.
            </p>
          </div>

          {/* FACILITIES MOSAIC LAYOUT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* BIG FEATURE CARD */}
            <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-3xl shadow-lg h-[420px]">
              <img
                src="/hero1.jpg"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                alt="Swimming Pool"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute bottom-5 left-5 text-white">
                <h3 className="text-2xl font-bold">Swimming Pool</h3>
                <p className="text-sm text-gray-200">
                  Relax in our luxury pool area
                </p>
              </div>
            </div>

            {/* SMALL CARD 1 */}
            <div className="relative group overflow-hidden rounded-3xl shadow-lg h-[200px]">
              <img
                src="/hero2.jpg"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                alt="Quad Biking"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white font-semibold">
                Quad Biking
              </div>
            </div>

            {/* SMALL CARD 2 */}
            <div className="relative group overflow-hidden rounded-3xl shadow-lg h-[200px]">
              <img
                src="/hero1.jpg"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                alt="Ball Painting"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white font-semibold">
                Ball Painting
              </div>
            </div>

            {/* SMALL CARD 3 */}
            <div className="relative group overflow-hidden rounded-3xl shadow-lg h-[200px]">
              <img
                src="/hero2.jpg"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                alt="Landmarks"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white font-semibold">
                Landmarks Tours
              </div>
            </div>

            {/* SMALL CARD 4 */}
            <div className="relative group overflow-hidden rounded-3xl shadow-lg h-[200px]">
              <img
                src="/hero1.jpg"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                alt="Hiking"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white font-semibold">
                Hiking Trails
              </div>
            </div>
          </div>
        </div>
      )}
      {active === "Dining" && (
        <div className="flex flex-col gap-12">
          {/* HEADER */}
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-4xl  text-[var(--primary)]">
              Fine Dining Experience
            </h3>
            <p className="text-gray-500 mt-3">
              Enjoy a curated selection of local and international cuisine
              prepared by expert chefs in an elegant atmosphere.
            </p>
          </div>

          {/* MAIN SPLIT LAYOUT */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* IMAGE SIDE */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl h-[450px] group">
              <img
                src="/hero2.jpg"
                alt="Dining"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-3xl font-bold">Novu Restaurant</h2>
                <p className="text-sm text-gray-200">
                  Where flavor meets elegance
                </p>
              </div>
            </div>

            {/* MENU STYLE CONTENT */}
            <div className="flex flex-col gap-6">
              <h4 className="text-2xl font-semibold text-gray-800">
                Today's Signature Menu
              </h4>

              <div className="flex flex-col gap-4">
                {[
                  {
                    title: "Grilled Steak",
                    desc: "Premium beef served with seasonal vegetables",
                    price: "$18",
                  },
                  {
                    title: "Seafood Platter",
                    desc: "Fresh catch of the day with lemon butter sauce",
                    price: "$22",
                  },
                  {
                    title: "Chicken Alfredo",
                    desc: "Creamy pasta with herbs and parmesan",
                    price: "$15",
                  },
                  {
                    title: "Vegetarian Bowl",
                    desc: "Healthy mix of grains, avocado and greens",
                    price: "$12",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-start border-b pb-3"
                  >
                    <div>
                      <h5 className="font-semibold text-gray-800">
                        {item.title}
                      </h5>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>

                    <span className="text-[var(--primary)] font-bold">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button className="mt-4 bg-[var(--primary)] text-white px-6 py-3 rounded-xl w-fit">
                Reserve Table
              </button>
            </div>
          </div>

          {/* BOTTOM HIGHLIGHTS */}
          <div className="grid md:grid-cols-4 gap-4 text-center">
            {[
              "Buffet Breakfast",
              "À la Carte Dining",
              "Outdoor Seating",
              "Private Dining",
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gray-50 border rounded-xl py-3 text-sm text-gray-600"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
      {active === "Gallery" && (
        <div className="flex flex-col gap-12">
          {/* HEADER */}
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-4xl text-[var(--primary)]">
              Explore Our Resort Gallery
            </h3>
            <p className="text-gray-500 mt-3">
              A visual journey through our rooms, dining, facilities, and
              unforgettable experiences.
            </p>
          </div>

          {/* MAIN GALLERY LAYOUT */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* BIG HERO IMAGE */}
            <div className="md:col-span-2 relative rounded-3xl overflow-hidden shadow-xl h-[450px] group">
              <img
                src="/hero1.jpg"
                alt="Gallery Main"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold">Luxury Resort View</h3>
                <p className="text-sm text-gray-200">
                  A blend of nature, comfort, and elegance
                </p>
              </div>
            </div>

            {/* SIDE THUMBNAILS */}
            <div className="flex flex-col gap-4">
              {["/hero2.jpg", "/hero1.jpg", "/hero2.jpg"].map((img, i) => (
                <div
                  key={i}
                  className="relative group overflow-hidden rounded-2xl shadow-lg h-[140px]"
                >
                  <img
                    src={img}
                    alt={`Gallery ${i}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />

                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition" />
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM IMAGE STRIP */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["/hero1.jpg", "/hero2.jpg", "/hero1.jpg", "/hero2.jpg"].map(
              (img, i) => (
                <div
                  key={i}
                  className="relative group overflow-hidden rounded-2xl shadow-md h-[160px]"
                >
                  <img
                    src={img}
                    alt={`Gallery grid ${i}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </section>
  );
}
