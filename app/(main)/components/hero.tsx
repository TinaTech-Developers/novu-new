"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="h-[90vh] bg-[url('/resort.jpg')] bg-cover bg-center flex items-center justify-center text-center text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-black/50 p-8 rounded-2xl"
      >
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          Welcome to Novu Resort
        </motion.h1>

        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg mb-6"
        >
          Luxury. Comfort. Nature.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-[var(--accent)] px-6 py-3 rounded-xl text-lg"
        >
          Book Your Stay
        </motion.button>
      </motion.div>
    </section>
  );
}
