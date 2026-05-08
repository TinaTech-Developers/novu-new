import BookingBar from "./components/bookingbar";
import HeroCarousel from "./components/herocarousel";
import Facilities from "./components/facilities";
import MainLayout from "./layout";

export default function Home() {
  return (
    <MainLayout>
      <div className="relative">
        <HeroCarousel />
        <BookingBar />
      </div>
      <Facilities />
    </MainLayout>
  );
}
