"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import { useState } from "react";
import { useRef } from "react";

export default function TwoBedsPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<any>(null);
  const rooms = [
    {
      name: "Flamingo",
      images: [
        "/flamingo/IMG_8542.jpg",
        "/flamingo/IMG_8538.jpg",
        "/flamingo/IMG_8514-Enhanced-NR.dng",
        "/flamingo/IMG_8531-Enhanced-NR.dng",
        "/flamingo/IMG_8537-Enhanced-NR.dng",
      ],
      description:
        "The definition of cosy. This villa offers comfort and warmth, perfect for a relaxing getaway.",
      price: 150,
      facilities: ["WiFi", "Air Conditioning", "Smart TV", "Kitchen"],
    },
    {
      name: "Eagle",
      images: ["/eagle/IMG_8675.JPG"],
      description:
        "Calm olive tones create a peaceful environment for rest and relaxation.",
      price: 150,
      facilities: ["WiFi", "Lounge Area", "Balcony", "Workspace"],
    },
    {
      name: "Dove",
      images: [
        "https://utfs.io/f/32d68877-3833-4950-8a9f-2bce02444f76-1nq6k8.jpg",
        "https://utfs.io/f/32d68877-3833-4950-8a9f-2bce02444f76-1nq6k8.jpg",
      ],
      description:
        "Minimalistic modern design offering a peaceful and elegant stay.",
      price: 150,
      facilities: ["WiFi", "Modern Interior", "Smart TV", "AC"],
    },
    {
      name: "Guineafowl",
      images: [
        "/guineafowl/IMG_8632.JPG",
        "/guineafowl/IMG_8594.JPG",
        "/guineafowl/IMG_8582.JPG",
        "/guineafowl/IMG_8568.JPG",
        "/guineafowl/IMG_8566.JPG",
      ],
      description: "A cozy and inviting space perfect for a relaxing stay.",
      price: 150,
      facilities: ["WiFi", "Cozy Atmosphere", "Balcony", "Workspace"],
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

        <div className="relative text-white px-4 md:px-6 max-w-2xl">
          <h1 className="text-2xl md:text-5xl font-bold">
            Two Bedroom Apartments
          </h1>
        </div>
      </section>

      {/* ================= ROOMS ================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-20 py-10 md:py-16 flex flex-col gap-12 md:gap-16">
        {rooms.map((room, i) => (
          <div key={i} className="flex flex-col gap-5 md:gap-6">
            {/* SWIPER */}
            <Swiper
              modules={[Autoplay]}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              className="w-full h-[380px]"
            >
              {room.images.map((img, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={img}
                    className="w-full h-[220px] sm:h-[280px] md:h-[380px] object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="flex gap-2 -mt-10 z-20 justify-center">
              {room.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => swiperRef.current?.slideTo(i)}
                  className={`h-[3px] rounded-full transition-all duration-300 ${
                    activeIndex === i ?
                      "w-10 bg-[var(--primary)]"
                    : "w-6 bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* TITLE + PRICE */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
              <h2 className="text-xl md:text-2xl font-bold text-[var(--primary)]">
                {room.name}
              </h2>

              <span className="text-base md:text-xl font-semibold text-gray-800">
                ${room.price} / night
              </span>
            </div>

            {/* GRID CONTENT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* DESCRIPTION */}
              <div>
                <h3 className="font-semibold mb-2 text-gray-700">
                  Description
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {room.description}
                </p>
              </div>

              {/* FACILITIES */}
              <div>
                <h3 className="font-semibold mb-2 text-gray-600">Facilities</h3>

                <div className="flex flex-wrap gap-2">
                  {room.facilities.map((f, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-400 px-3 py-1 rounded-full"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button className="bg-[var(--primary)] text-white px-6 py-2 rounded-lg w-full sm:w-auto">
                Book Now
              </button>

              <button className="border px-6 py-2 rounded-lg text-gray-600 w-full sm:w-auto">
                View Details
              </button>
            </div>

            <div className="border-t mt-4 md:mt-6" />
          </div>
        ))}
      </section>
    </div>
  );
}
