"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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

        if (!res.ok) {
          throw new Error("Failed to fetch rooms");
        }

        const data = await res.json();

        setRooms(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch rooms", error);
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
      <section className="relative h-[50vh] md:h-[70vh] flex items-center justify-center text-center overflow-hidden">
        <Image
          src="/hero1.jpg"
          alt="Three Bedroom Apartments"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <h1 className="relative z-10 text-white text-3xl md:text-5xl font-semibold">
          Three Bedroom Apartments
        </h1>
      </section>

      {/* ================= ROOMS ================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-10 lg:px-20 py-12 flex flex-col gap-16">
        {loading ?
          <div className="text-center text-gray-500 py-20">
            Loading rooms...
          </div>
        : rooms.length === 0 ?
          <div className="text-center text-gray-500 py-20">
            No rooms available
          </div>
        : rooms.map((room, i) => (
            <div
              key={room._id}
              className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
            >
              {/* ================= LEFT: SWIPER ================= */}
              <div className="relative overflow-hidden rounded-2xl shadow-xl border border-gray-200">
                <Swiper
                  modules={[Autoplay]}
                  autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                  }}
                  loop={true}
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
                  {(room.images || []).map((img: string, idx: number) => (
                    <SwiperSlide key={idx}>
                      <div className="relative w-full h-[280px] md:h-[420px]">
                        <Image
                          src={img}
                          alt={room.name || "Room image"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* ================= INDICATORS ================= */}
                <div className="absolute z-10 bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {(room.images || []).map((_: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => swiperRefs.current[i]?.slideToLoop(idx)}
                      className={`h-[4px] rounded-full transition-all duration-300 ${
                        activeIndexes[i] === idx ?
                          "w-10 bg-white"
                        : "w-5 bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* ================= RIGHT: CONTENT ================= */}
              <div className="flex flex-col gap-5">
                <div>
                  <h2 className="text-3xl font-semibold text-gray-800">
                    {room.name}
                  </h2>

                  <p className="text-lg text-[var(--primary)] font-medium mt-2">
                    ${room.price} / night
                  </p>
                </div>

                <p className="text-gray-600 leading-relaxed">
                  {room.description}
                </p>

                {/* ================= STATUS ================= */}
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      room.available ? "bg-green-500" : "bg-red-500"
                    }`}
                  />

                  <span className="text-sm text-gray-700">
                    {room.available ?
                      "Available for booking"
                    : "Currently booked"}
                  </span>
                </div>

                {/* ================= FACILITIES ================= */}
                <div className="flex flex-wrap gap-2">
                  {(room.facilities || []).map(
                    (facility: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1 rounded-full"
                      >
                        {facility}
                      </span>
                    ),
                  )}
                </div>

                {/* ================= BUTTON ================= */}
                <div className="pt-2">
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
