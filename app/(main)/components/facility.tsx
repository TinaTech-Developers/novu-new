import React from "react";

function facility() {
  return (
    <>
      <div className="flex flex-col gap-10">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto">
          <h3 className="text-4xl font-bold text-[var(--primary)]">
            Resort Facilities & Activities
          </h3>

          <p className="text-gray-500 mt-3">
            Discover exciting outdoor adventures, relaxation spaces, and
            unforgettable experiences designed for every guest.
          </p>
        </div>

        {/* FACILITIES GRID */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Swimming Pool",
              image: "/hero1.jpg",
            },
            {
              title: "Quad Biking",
              image: "/hero2.jpg",
            },
            {
              title: "Ball Painting",
              image: "/hero1.jpg",
            },
            {
              title: "Landmarks Tours",
              image: "/hero2.jpg",
            },
            {
              title: "Hiking Trails",
              image: "/hero1.jpg",
            },
            {
              title: "Relaxation Lounge",
              image: "/hero2.jpg",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="relative group overflow-hidden rounded-3xl shadow-lg h-[240px]"
            >
              {/* IMAGE */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* TITLE */}
              <div className="absolute bottom-4 left-4 text-white">
                <h4 className="text-lg font-semibold">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM HIGHLIGHT STRIP */}
        <div className="grid md:grid-cols-5 gap-3 text-center">
          {[
            "Adventure Activities",
            "Family Friendly",
            "Outdoor Experience",
            "Nature Exploration",
            "Relaxation Zones",
          ].map((tag, i) => (
            <div
              key={i}
              className="bg-gray-50 border rounded-xl py-3 text-sm text-gray-600"
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default facility;
