import Link from "next/link";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";

export default function Header() {
  const mail = "mauryaabc@gmail.com";

  return (
    <header className="bg-background border-b border-primary sticky top-0 z-50">
      {/* Header Top Bar */}
      <div className="border-b border-secondary w-full py-2">
        <div className="container flex justify-between items-center">
          <span className="flex gap-1">
            <span className="hidden md:block">Contact Us:</span>{" "}
            <Link href={`mailto:${mail}`} className="hover:text-primary">
              {mail}
            </Link>
          </span>
          <span className="flex gap-2 text-sm">
            <Link href="/" className="hover:text-primary">
              <FaYoutube />
            </Link>
            <Link href="/" className="hover:text-primary">
              <FaInstagram />
            </Link>
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="container flex justify-between items-center text-sm py-2">
        <p className="text-xl md:text-2xl font-oxanium">
          REX<span className="text-primary font-bold">TERIA</span>
        </p>

        {/* <nav className="flex items-center gap-4">
          <Link href="/" className="hover:text-accent">Home</Link>
          <Link href="/" className="hover:text-accent">Mods</Link>
          <Link href="/" className="hover:text-accent">About Us</Link>
        </nav> */}

        <p className="font-oxanium flex items-center gap-1 text-base md:text-lg text-primary cursor-pointer">
          <MdOutlineShoppingBag className="text-foreground" /> (0) &#8377;0.00
        </p>
      </div>
    </header>
  );
}
