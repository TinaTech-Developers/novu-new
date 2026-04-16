"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const slides = [
  {
    image: "/hero1.jpg",
    title: "Relax at Novu Resort",
    subtitle: "Luxury & Comfort in Nature",
  },
  {
    image: "/hero2.jpg",
    title: "Experience Serenity",
    subtitle: "Your perfect getaway",
  },
];

export default function HeroCarousel() {
  const router = useRouter();
  return (
    <div className="relative h-[70vh]">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 5000 }}
        loop
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="h-full bg-cover bg-center flex items-center justify-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50" />

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative text-center text-white px-4"
              >
                <h1 className="text-4xl md:text-6xl font mb-4">
                  {slide.title}
                </h1>
                <p className="text-lg mb-6">{slide.subtitle}</p>

                <motion.button
                  onClick={() => router.push("/rooms")}
                  whileHover={{ scale: 1.1 }}
                  className="bg-[var(--accent)] px-6 py-3 rounded-xl"
                >
                  Book Now
                </motion.button>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
