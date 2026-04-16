"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function ThreeBedsPage() {
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const rooms = [
    {
      name: "Sunbird Suite",
      images: ["/sunbird/1.jpg", "/sunbird/2.jpg", "/sunbird/3.jpg"],
      description:
        "A spacious three-bedroom suite designed for families or groups, offering comfort and modern elegance.",
      price: 220,
      facilities: ["WiFi", "Air Conditioning", "Kitchen", "Smart TV"],
    },
    {
      name: "Horizon Villa",
      images: ["/horizon/1.jpg", "/horizon/2.jpg", "/horizon/3.jpg"],
      description:
        "Enjoy breathtaking views and a relaxing atmosphere in this premium three-bed villa.",
      price: 250,
      facilities: ["Balcony", "Lounge Area", "WiFi", "Workspace"],
    },
  ];

  return (
    <div className="bg-white">
      {/* ================= HERO ================= */}
      <section className="relative h-[50vh] md:h-[70vh] flex items-center justify-center text-center">
        <img
          src="/hero1.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <h1 className="relative text-white text-3xl md:text-5xl font-bold">
          Three Bedroom Apartments
        </h1>
      </section>

      {/* ================= ROOMS ================= */}
      <section className="max-w-6xl mx-auto px-4 md:px-20 py-12 flex flex-col gap-16">
        {rooms.map((room, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          >
            {/* ================= LEFT: SWIPER ================= */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <Swiper
                modules={[Autoplay]}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                }}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                className="h-[280px] md:h-[420px]"
              >
                {room.images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <img src={img} className="w-full h-full object-cover" />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* segmented bar */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {room.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => swiperRef.current?.slideTo(idx)}
                    className={`h-[3px] rounded-full transition-all ${
                      activeIndex === idx ? "w-10 bg-white" : "w-6 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* ================= RIGHT: CONTENT ================= */}
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--primary)]">
                {room.name}
              </h2>

              <p className="text-gray-600 leading-relaxed">
                {room.description}
              </p>

              <p className="text-lg font-semibold text-gray-800">
                ${room.price} / night
              </p>

              {/* facilities */}
              <div className="flex flex-wrap gap-2">
                {room.facilities.map((f, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-gray-100 px-3 py-1 rounded-full"
                  >
                    {f}
                  </span>
                ))}
              </div>

              {/* buttons */}
              <div className="flex gap-3 mt-3">
                <button className="bg-[var(--primary)] text-white px-6 py-2 rounded-lg">
                  Book Now
                </button>

                <button className="border px-6 py-2 rounded-lg">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
