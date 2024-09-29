import useCarousal from "@/hooks/use-carousal";
import { CartModType } from "@/types/cart-types";
import { ModType } from "@/types/mod-types";
import { Minus, Plus, ThumbsUp, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Rating from "../shared/rating";
import { Button } from "../ui/button";
import { Card, CardContent, CardTitle } from "../ui/card";
import { deleteCartFn, patchCartFn } from "@/services/cart";
import { showAlert } from "@/services/handle-api";

export default function CartCard({
  cart,
  getCartData,
}: {
  cart: CartModType;
  getCartData: () => void;
}) {
  const { handleSetImages } = useCarousal();
  const item = cart?.mod_id as ModType;

  const action = (mod_id: string, type: string) => {
    patchCartFn({
      type,
      mod_id: mod_id,
    })
      .then((data) => showAlert(data))
      .then(() => getCartData());
  };

  const deleteFn = () => {
    const formData = new FormData();
    formData.append("mod_id", item?._id);
    deleteCartFn(formData)
      .then((data) => showAlert(data))
      .then(() => getCartData());
  };

  return (
    <Card
      key={`${cart.mod_id}${cart.quantity}`}
      className="shadow-md transition-all hover:shadow-lg rounded-lg overflow-hidden"
    >
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={item?.main_image?.url}
          alt={item?.title}
          width={500}
          height={500}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 cursor-pointer"
          onClick={() =>
            handleSetImages(
              [item?.main_image?.url, ...item?.images.map((img) => img.url)],
              0,
            )
          }
        />
      </div>
      <CardContent className="p-4">
        <CardTitle className="text-xl font-semibold mb-2">
          <Link
            href={`/mods/${item?.slug}`}
            className="w-full text-ellipsis whitespace-nowrap overflow-hidden block"
          >
            {item?.title}
          </Link>
        </CardTitle>
        <div className="flex justify-between items-center mb-4">
          <Rating rating={3} className="justify-start mt-2" />
          <div className="flex gap-2 items-center">
            <ThumbsUp className="text-primary text-lg w-4 h-4" />
            <span className="text-sm text-gray-600">{item?.likes} Likes</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold">
            Price: ₹
            <span className="line-through text-red-500">{item?.price}</span>{" "}
            <span className="text-primary">{item?.discount_price}</span>
          </p>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => action(item?._id, "asc")}
              disabled={cart.quantity === 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-lg">{cart?.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => action(item?._id, "inc")}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <p className="text-lg font-semibold">
            Total: ₹{cart?.price.toFixed(0)}
          </p>
          <Button
            size="sm"
            variant="destructive"
            className="flex items-center gap-2"
            onClick={deleteFn}
          >
            <Trash size={16} />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
