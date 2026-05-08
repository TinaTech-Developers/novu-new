export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-16 grid md:grid-cols-4 gap-10">
        {/* BRAND SECTION */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-white">Novu Resort</h2>

          <p className="text-sm leading-relaxed text-gray-400">
            Experience luxury, comfort, and African hospitality at its finest.
            Where business meets relaxation in perfect harmony.
          </p>

          <div className="text-sm text-gray-400">📍 Harare, Zimbabwe</div>
          <div className="text-sm text-gray-400">📞 +263 000 000 000</div>
          <div className="text-sm text-gray-400">✉ info@novuresort.com</div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Accommodation</li>
            <li className="hover:text-white cursor-pointer">Dining</li>
            <li className="hover:text-white cursor-pointer">Facilities</li>
            <li className="hover:text-white cursor-pointer">Conferences</li>
            <li className="hover:text-white cursor-pointer">Gallery</li>
          </ul>
        </div>

        {/* SERVICES */}
        <div>
          <h3 className="text-white font-semibold mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            <li>Room Booking</li>
            <li>Event Hosting</li>
            <li>Restaurant Services</li>
            <li>Outdoor Activities</li>
            {/* <li>Airport Pickup</li> */}
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="text-white font-semibold mb-4">Stay Updated</h3>

          <p className="text-sm text-gray-400 mb-4">
            Subscribe for offers and updates.
          </p>

          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-lg bg-gray-800 text-white outline-none"
            />

            <button className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Novu Resort. All rights reserved.
      </div>
    </footer>
  );
}
