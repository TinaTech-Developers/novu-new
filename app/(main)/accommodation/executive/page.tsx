"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import RoomBookingCard from "./_components/roombookingcard";
import { motion } from "framer-motion";

export default function ExecutivePage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH ROOMS =================
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("/api/rooms?category=executive");

        const data = await res.json();

        console.log("ROOMS RESPONSE:", data);

        // ✅ FIX
        if (Array.isArray(data)) {
          setRooms(data);
        } else {
          setRooms([]);
          console.error("API Error:", data);
        }
      } catch (error) {
        console.error("Failed to fetch executive rooms", error);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);
  return (
    <div className="bg-white">
      {/* ================= HERO ================= */}
      <section className="relative h-[50vh] md:h-[70vh] flex items-center justify-center">
        <img
          src="/hero1.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <h1 className="relative text-white text-3xl md:text-5xl">
          Executive Rooms
        </h1>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="max-w-6xl mx-auto px-4 md:px-20 py-12 space-y-10">
        {loading ?
          <div className="text-center text-gray-500">
            Loading executive rooms...
          </div>
        : rooms.map((room, i) => (
            <motion.div
              key={room._id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 border rounded overflow-hidden shadow-sm hover:shadow-lg transition"
            >
              {/* ================= IMAGE SIDE ================= */}
              <div className="h-[250px] md:h-[450px]">
                <Swiper
                  modules={[Autoplay]}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  className="h-full"
                >
                  {room.images?.map((img: string, idx: number) => (
                    <SwiperSlide key={idx}>
                      <img src={img} className="w-full h-full object-cover" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* ================= CONTENT SIDE ================= */}
              <div className="p-4 sm:p-6 flex flex-col justify-between gap-6 h-full">
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <h2 className="text-xl sm:text-2xl text-[var(--primary)] font-semibold">
                      {room.name}
                    </h2>

                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-500">Off Peak</p>

                      <p className="text-lg font-semibold text-gray-800">
                        ${room.pricing?.offPeak} / night
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Peak: ${room.pricing?.peak}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 mt-4 text-sm leading-relaxed">
                    {room.description}
                  </p>

                  {/* EXECUTIVE BED & BREAKFAST */}
                  {room.pricing?.bedAndBreakfastOffPeak && (
                    <div className="mt-4 bg-gray-100 rounded-xl p-3 text-sm">
                      <p className="font-medium text-gray-700 mb-1">
                        Bed & Breakfast
                      </p>

                      <p className="text-gray-600">
                        Off Peak: ${room.pricing.bedAndBreakfastOffPeak}
                      </p>

                      <p className="text-gray-600">
                        Peak: ${room.pricing.bedAndBreakfastPeak}
                      </p>
                    </div>
                  )}
                </div>

                {/* FACILITIES */}
                <div className="flex flex-wrap gap-2">
                  {room.facilities?.map((f: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                <RoomBookingCard room={room} />
              </div>
            </motion.div>
          ))
        }
      </section>
    </div>
  );
}
