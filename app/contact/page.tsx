"use client";

import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* ================= HERO ================= */}
      <section className="relative h-[55vh] flex items-center justify-center text-center">
        <img
          src="/hero2.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Contact"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative text-white px-6">
          <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
          <p className="mt-3 text-gray-200">
            We’re here to assist you with bookings, inquiries, and support
          </p>
        </div>
      </section>

      {/* ================= CONTACT INFO ================= */}
      <section className="max-w-6xl mx-auto px-6 md:px-20 py-16 grid md:grid-cols-3 gap-10 text-center">
        {[
          {
            title: "Location",
            value: "📍 Nyanga, Zimbabwe",
          },
          {
            title: "Call Us",
            value: "📞 +263 77 224 1125 | 📞 +263 77 214 6008",
          },
          {
            title: "Email",
            value: "novuresort@gmail.com",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-2"
          >
            <h3 className="text-lg font-semibold text-[var(--primary)]">
              {item.title}
            </h3>
            <p className="text-gray-600">{item.value}</p>
          </motion.div>
        ))}
      </section>

      {/* ================= MAIN SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 md:px-20 pb-20 grid md:grid-cols-2 gap-12">
        {/* LEFT - FORM */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gray-50 p-8 rounded-3xl shadow-sm"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Send Us a Message
          </h2>

          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="px-4 py-3 rounded-lg border outline-none focus:border-[var(--primary)]"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="px-4 py-3 rounded-lg border outline-none focus:border-[var(--primary)]"
            />

            <input
              type="text"
              placeholder="Subject"
              className="px-4 py-3 rounded-lg border outline-none focus:border-[var(--primary)]"
            />

            <textarea
              rows={5}
              placeholder="Your Message"
              className="px-4 py-3 rounded-lg border outline-none focus:border-[var(--primary)]"
            />

            <button className="bg-[var(--primary)] text-white py-3 rounded-lg mt-2 hover:opacity-90 transition">
              Send Message
            </button>
          </form>
        </motion.div>

        {/* RIGHT - MAP / IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden shadow-lg h-[400px] md:h-auto"
        >
          <img
            src="/hero1.jpg"
            alt="Map"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-xl font-semibold">Visit Our Resort</h3>
            <p className="text-sm text-gray-200">
              Located in the heart of Harare
            </p>
          </div>
        </motion.div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-gray-900 text-white text-center py-16 px-6">
        <h2 className="text-3xl font-bold">Ready to Book Your Stay?</h2>
        <p className="text-gray-300 mt-3">
          Contact us today and let us plan your perfect experience
        </p>

        <button className="mt-6 bg-[var(--primary)] px-6 py-3 rounded-lg">
          Book Now
        </button>
      </section>
    </div>
  );
}
