"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import RoomBookingCard from "./_components/roombookingcard";
import { motion } from "framer-motion";

export default function ExecutivePage() {
  const rooms = [
    {
      name: "Shumba",
      price: 80,
      images: ["/shumba/IMG_8942.JPG", "/shumba/IMG_8936.JPG"],
      description:
        "The Executive Single Bed Shumba offers a refined stay with comfort, privacy and modern elegance.",
    },
    {
      name: "Shoko",
      price: 80,
      images: [
        "/shoko/IMG_8968.JPG",
        "/shoko/IMG_8981.jpg",
        "/shoko/IMG_8976.jpg",
      ],
      description:
        "A calm and contemporary executive room designed for business and leisure stays.",
    },
    {
      name: "Chihwa",
      price: 80,
      images: [
        "/chihwa/IMG_8993.JPG",
        "/chihwa/IMG_9000.jpg",
        "/chihwa/IMG_9011.jpg",
      ],
      description:
        "Elegant interior design offering a peaceful and premium accommodation experience.",
    },
    {
      name: "Makombe",
      price: 80,
      images: [
        "/makombe/IMG_9026.JPG",
        "/makombe/IMG_9059.JPG",
        "/makombe/IMG_9050.JPG",
      ],
      description:
        "Elegant interior design offering a peaceful and premium accommodation experience.",
    },
  ];

  return (
    <div className="bg-white">
      {/* ================= HERO ================= */}
      <section className="relative h-[50vh] md:h-[70vh] flex items-center justify-center">
        <img
          src="/hero1.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <h1 className="relative text-white text-3xl md:text-5xlold">
          Executive Rooms
        </h1>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="max-w-6xl mx-auto px-4 md:px-20 py-12 space-y-10">
        {rooms.map((room, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            viewport={{ once: true }}
            key={i}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 border rounded- overflow-hidden shadow-sm hover:shadow-lg transition"
          >
            {/* IMAGE SIDE */}
            <div className="h-[250px] md:h-[320px]">
              <Swiper
                modules={[Autoplay]}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                className="h-full"
              >
                {room.images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <img src={img} className="w-full h-full object-cover" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* CONTENT SIDE */}
            <div className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-[var(--primary)]">
                    {room.name}
                  </h2>

                  <span className="text-lg font-medium text-gray-800">
                    ${room.price} / night
                  </span>
                </div>

                <p className="text-gray-600 mt-4 text-sm leading-relaxed">
                  {room.description}
                </p>
              </div>

              <RoomBookingCard
                room={{
                  name: room.name,
                  price: room.price,
                  bookedDates: [{ start: "2026-04-20", end: "2026-04-22" }],
                }}
              />
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
