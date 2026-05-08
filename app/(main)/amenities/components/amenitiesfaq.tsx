"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AmenitiesFAQ() {
  const faqs = [
    {
      q: "Free High-Speed WiFi",
      a: "Enjoy unlimited high-speed internet access throughout the entire resort, including rooms and outdoor areas.",
    },
    {
      q: "24/7 Room Service",
      a: "Our dedicated team is available at any time to deliver food, drinks, and guest services directly to your room.",
    },
    {
      q: "Secure Parking Area",
      a: "We provide fully monitored and secure parking facilities for all our guests during their stay.",
    },
    {
      q: "Air Conditioned Rooms",
      a: "All rooms are fully air-conditioned to ensure maximum comfort in every season.",
    },
    {
      q: "Airport Shuttle Service",
      a: "Convenient pickup and drop-off services are available upon request for hassle-free travel.",
    },
    {
      q: "Laundry & Dry Cleaning",
      a: "Professional laundry and dry cleaning services are available daily for guest convenience.",
    },
    {
      q: "Outdoor Lounge & Garden",
      a: "Relax in beautifully designed outdoor spaces surrounded by nature and fresh air.",
    },
    {
      q: "Conference & Event Facilities",
      a: "Fully equipped venues suitable for meetings, conferences, weddings, and private events.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-4 bg-white">
      {/* HEADER */}
      <div className="w-full mx-auto text-center px-6">
        <h2 className="text-4xl  text-[var(--primary)]">Hotel Facilities</h2>
        <p className="text-gray-500 mt-3">
          Everything you need for a seamless and comfortable stay
        </p>
      </div>

      {/* FAQ LIST */}
      <div className="max-w-3xl mx-auto mt-14 px-6 space-y-4">
        {faqs.map((item, index) => (
          <div key={index} className="border-b pb-4">
            {/* QUESTION */}
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex justify-between items-center text-left py-4 group"
            >
              <span className="text-gray-800 group-hover:text-[var(--primary)] transition font-medium">
                {item.q}
              </span>

              <span className="text-gray-400 text-xl">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>

            {/* ANSWER */}
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-gray-500 pb-4 pr-6">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
