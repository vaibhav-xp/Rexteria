import Image from "next/image";
import { FaRegHeart } from "react-icons/fa";
import { IoStarSharp } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";

export default function Mods() {
  return (
    <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-12 my-16">
      <ModeCard />
      <ModeCard />
      <ModeCard />
      <ModeCard />
      <ModeCard />
      <ModeCard />
    </div>
  );
}

function ModeCard() {
  return (
    <div className="min-h-[300px] group relative overflow-hidden pb-4">
      {/* Image */}
      <div className="w-full h-[75%] relative group overflow-hidden rounded-xl cursor-pointer">
        <Image
          src="https://i.pinimg.com/originals/d1/00/56/d100565156936f0f63992893302f9624.png"
          layout="fill"
          className="group-hover:scale-110 brightness-50 group-hover:brightness-100 transition-all duration-300"
          objectFit="cover"
          objectPosition="center"
          alt="car"
        />
      </div>

      {/* Features */}
      <div className="absolute top-2 group-hover:right-2 grid gap-2 -right-10 transition-all duration-300">
        <p className="w-10 h-10 rounded-lg bg-card group-hover:bg-accent grid text-primary group-hover:text-white place-content-center border border-primary cursor-pointer transition-colors duration-300">
          <FaRegHeart />
        </p>
        <p className="w-10 h-10 rounded-lg bg-card group-hover:bg-accent grid text-primary group-hover:text-white place-content-center border border-primary cursor-pointer transition-colors duration-300">
          <MdOutlineShoppingBag />
        </p>
      </div>

      {/* Text */}
      <div className="text-center flex flex-col gap-2 py-2 items-center">
        <p className="flex justify-center gap-1">
          <IoStarSharp className="text-primary" />
          <IoStarSharp className="text-primary" />
          <IoStarSharp className="text-primary" />
          <IoStarSharp className="text-primary" />
          <IoStarSharp />
        </p>
        <p className="text-base hover:text-primary cursor-pointer font-oxanium inline-flex transition-colors duration-300">
          GTA 5 Fortuner
        </p>
        <p className="text-base text-primary flex items-center gap-2">
          &#x20B9;230.00
          <span className="text-sm text-muted ml-2 line-through font-semibold">
            &#x20B9;19.00
          </span>
          <span className="text-base text-primary font-oxanium">-19%</span>
        </p>
      </div>
    </div>
  );
}
