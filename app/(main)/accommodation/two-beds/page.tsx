"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import RoomBookingCard from "../executive/_components/roombookingcard";

export default function TwoBedsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeIndexes, setActiveIndexes] = useState<{
    [key: number]: number;
  }>({});

  const swiperRefs = useRef<{ [key: number]: any }>({});

  // ================= FETCH ROOMS =================
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("/api/rooms?category=two-beds");

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

        <div className="relative text-white px-4 md:px-6 max-w-2xl">
          <h1 className="text-3xl md:text-5xl">Two Bedroom Apartments</h1>

          <p className="mt-4 text-sm md:text-base text-gray-200">
            Experience luxury, comfort, and breathtaking surroundings at Novu
            Resort.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-20 py-10 md:py-16 flex flex-col gap-12 md:gap-16">
        {loading ?
          <div className="text-center text-gray-500">Loading apartments...</div>
        : rooms.map((room, i) => (
            <div key={room._id} className="flex flex-col gap-5 md:gap-6">
              {/* ================= SWIPER ================= */}
              <Swiper
                modules={[Autoplay]}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                onSlideChange={(swiper) =>
                  setActiveIndexes((prev) => ({
                    ...prev,
                    [i]: swiper.realIndex,
                  }))
                }
                onSwiper={(swiper) => {
                  swiperRefs.current[i] = swiper;
                }}
                className="w-full  overflow-hidden shadow-lg"
              >
                {room.images.map((img: string, idx: number) => (
                  <SwiperSlide key={idx}>
                    <img
                      src={img}
                      className="w-full h-[220px] sm:h-[320px] md:h-[450px] object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* ================= INDICATORS ================= */}
              <div className="flex gap-2 -mt-8 z-20 justify-center">
                {room.images.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => swiperRefs.current[i]?.slideTo(idx)}
                    className={`h-[3px] rounded-full transition-all duration-300 ${
                      activeIndexes[i] === idx ?
                        "w-10 bg-[var(--primary)]"
                      : "w-6 bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* ================= TITLE ================= */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                <h2 className="text-2xl md:text-3xl text-[var(--primary)]">
                  {room.name}
                </h2>

                <div className="text-left sm:text-right">
                  <p className="text-sm text-gray-500">Off Peak</p>

                  <p className="text-lg font-semibold text-gray-800">
                    ${room.pricing?.offPeak} / night
                  </p>

                  <p className="text-xs text-gray-500 mt-">
                    Peak: ${room.pricing?.peak}
                  </p>
                </div>
              </div>

              {/* ================= CONTENT GRID ================= */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* DESCRIPTION */}
                <div>
                  <h3 className="font-semibold mb-3 text-gray-800 text-lg">
                    Description
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {room.description}
                  </p>
                </div>
                {/* THREE BED & BREAKFAST */}
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

                {/* FACILITIES */}
                <div>
                  <h3 className="font-semibold mb-3 text-gray-800 text-lg">
                    Facilities
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {room.facilities.map((facility: string, idx: number) => (
                      <span
                        key={idx}
                        className="
                          text-xs
                          bg-gray-100
                          border border-gray-200
                          text-gray-700
                          px-3 py-2
                          rounded-full
                        "
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ================= BUTTONS ================= */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <RoomBookingCard room={room} />
              </div>

              <div className="border-t border-gray-200 mt-4 md:mt-6" />
            </div>
          ))
        }
      </section>
    </div>
  );
}
