import Banner from "@/components/Home/Banner";
import Header from "@/components/Home/Header";
import Mods from "@/components/Home/Mods";

export default function Home() {
  return (
    <main className="h-[200vh]">
      <Header />
      <Banner />
      <Mods />
    </main>
  );
}
