import Image from "next/image";
import Hero from "./components/hero";
import BookingBar from "./components/bookingbar";
import HeroCarousel from "./components/herocarousel";
import Facilities from "./components/facilities";

export default function Home() {
  return (
    <>
      <div className="relative">
        <HeroCarousel />
        <BookingBar />
      </div>
      <Facilities />
    </>
  );
}
