"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import RoomBookingCard from "../executive/_components/roombookingcard";

export default function ThreeBedsPage() {
  const swiperRefs = useRef<{ [key: number]: any }>({});
  const [activeIndexes, setActiveIndexes] = useState<{
    [key: number]: number;
  }>({});

  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH ROOMS =================
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("/api/rooms?category=three-beds");
        const data = await res.json();

        setRooms(data || []);
      } catch (error) {
        console.error("Failed to fetch rooms", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="bg-white">
      {/* ================= HERO ================= */}
      <section className="relative h-[50vh] md:h-[70vh] flex items-center justify-center text-center">
        <img
          src="/hero1.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <h1 className="relative text-white text-3xl md:text-5xl">
          Three Bedroom Apartments
        </h1>
      </section>

      {/* ================= ROOMS ================= */}
      <section className="max-w-6xl mx-auto px-4 md:px-20 py-12 flex flex-col gap-16">
        {loading ?
          <div className="text-center text-gray-500">Loading rooms...</div>
        : rooms.map((room, i) => (
            <div
              key={room._id || i}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            >
              {/* ================= LEFT: SWIPER ================= */}
              <div className="relative  overflow-hidden shadow-lg">
                <Swiper
                  modules={[Autoplay]}
                  autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                  }}
                  onSwiper={(swiper) => {
                    swiperRefs.current[i] = swiper;
                  }}
                  onSlideChange={(swiper) =>
                    setActiveIndexes((prev) => ({
                      ...prev,
                      [i]: swiper.realIndex,
                    }))
                  }
                  className="h-[280px] md:h-[420px]"
                >
                  {room.images?.map((img: string, idx: number) => (
                    <SwiperSlide key={idx}>
                      <img src={img} className="w-full h-full object-cover" />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* ================= INDICATORS ================= */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  {room.images?.map((_: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => swiperRefs.current[i]?.slideTo(idx)}
                      className={`h-[3px] rounded-full transition-all ${
                        activeIndexes[i] === idx ?
                          "w-10 bg-white"
                        : "w-6 bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* ================= RIGHT: CONTENT ================= */}
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl md:text-3xl text-[var(--primary)]">
                  {room.name}
                </h2>

                <p className="text-gray-600 leading-relaxed">
                  {room.description}
                </p>

                <p className="text-lg font-semibold text-gray-800">
                  ${room.price} / night
                </p>

                {/* ================= FACILITIES ================= */}
                <div className="flex flex-wrap gap-2">
                  {room.facilities?.map((f: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-400 px-3 py-1 rounded-full"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {/* ================= BUTTONS ================= */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <RoomBookingCard room={room} />
                </div>
              </div>
            </div>
          ))
        }
      </section>
    </div>
  );
}
