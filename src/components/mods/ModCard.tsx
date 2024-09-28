import { addToCartFn } from "@/services/cart";
import { showAlert } from "@/services/handle-api";
import { ModType } from "@/types/mod-types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import Rating from "../shared/rating";
import { MouseEvent } from "react";
import { addToWishlistFn } from "@/services/wishlist";

export default function ModCard({ mod }: { mod: ModType }) {
  const router = useRouter();

  const addToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const formData = new FormData();
    formData.append("mod_id", mod._id);
    addToCartFn(formData).then((data) => showAlert(data));
  };
  const addToWishlilst = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const formData = new FormData();
    formData.append("mod_id", mod._id);
    addToWishlistFn(formData).then((data) => showAlert(data));
  };

  return (
    <div
      className="bg-card shadow-md rounded-lg overflow-hidden group relative transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/mods/${mod?.slug}`);
      }}
    >
      {/* Image */}
      <div className="relative h-40 w-full overflow-hidden ">
        <Image
          src={mod?.main_image?.url}
          layout="fill"
          className="group-hover:scale-110 brightness-75 group-hover:brightness-100 transition-all duration-500 object-cover"
          alt={mod?.title}
        />
      </div>

      {/* Hover Icons */}
      <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          className="p-2 bg-white text-card rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors duration-300"
          onClick={addToWishlilst}
        >
          <FaRegHeart />
        </button>
        <button
          className="p-2 bg-white text-card rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors duration-300"
          onClick={addToCart}
        >
          <MdOutlineShoppingBag />
        </button>
      </div>

      {/* Details */}
      <div className="p-4 text-center">
        <Rating rating={mod?.rating} />
        <h5 className="text-lg font-bold text-white truncate mt-2 group-hover:text-primary transition-colors duration-300">
          {mod?.title}
        </h5>
        <div className="flex flex-col sm:flex-row justify-center items-center mt-2 text-gray-700 ">
          <span className="text-primary font-semibold text-xl">
            &#x20B9;{mod?.discount_price.toFixed(0)}
          </span>
          <span>
            <span className="text-sm text-gray-400 ml-3 line-through">
              &#x20B9; {mod?.price}
            </span>
            <span className="ml-3 text-base font-semibold text-primary">
              -{mod?.discount}%
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
