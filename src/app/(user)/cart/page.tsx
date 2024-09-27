"use client";

import { useState } from "react";
import Link from "next/link";
import Title from "@/components/ui/title";
import Image from "next/image";
import img from "@/assets/bg-mods.webp";
import Rating from "@/components/shared/rating";
import { ThumbsUp, Minus, Plus, Trash } from "lucide-react";
import useCarousal from "@/hooks/use-carousal";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Cart() {
  const [cartItems, setCartItems] = useState(
    Array.from({ length: 10 }, (_, index) => ({
      id: index,
      name: "Suzuki 2024 Fastest Car",
      price: 100,
      discount: 10,
      quantity: 1,
      image: img, // Replace with actual image URL
    })),
  );
  const { handleSetImages } = useCarousal();

  const increaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  };

  const deleteItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <>
      <Title title="Cart" />
      <div className="grid grid-rows-[calc(100vh-210px)_1fr] md:grid-rows-[calc(100vh-180px)_1fr] grid-cols-1">
        <div className="mt-4 overflow-y-scroll grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Cart Item Card */}
          {cartItems.map((item) => {
            const discountedPrice =
              item.price - (item.price * item.discount) / 100;
            const totalPrice = discountedPrice * item.quantity;

            return (
              <Card
                key={item.id}
                className="aspect-square shadow-md transition-all hover:shadow-lg rounded-lg"
              >
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 cursor-pointer"
                    onClick={() => handleSetImages([item.image], 0)}
                  />
                </div>
                <CardContent className="p-4">
                  <CardTitle className="text-xl font-semibold mb-2">
                    <Link href={`/product/${item.id}`}>{item.name}</Link>
                  </CardTitle>
                  <div className="flex justify-between items-center mb-4">
                    <Rating rating={3} className="justify-start mt-2" />
                    <div className="flex gap-2 items-center">
                      <ThumbsUp className="text-primary text-lg w-4 h-4" />
                      <span className="text-sm text-gray-600">0 Likes</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">
                      Price: ₹
                      <span className="line-through text-red-500">
                        {item.price.toFixed(2)}
                      </span>{" "}
                      <span className="text-primary">
                        {discountedPrice.toFixed(2)}
                      </span>
                    </p>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => decreaseQuantity(item.id)}
                        disabled={item.quantity === 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-lg">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-lg font-semibold">
                      Total: ₹{totalPrice.toFixed(2)}
                    </p>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex items-center gap-2"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash size={16} />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="p-4 rounded-lg bg-card mt-4 mr-1">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-xl font-bold">
              Total Amount: ₹
              {cartItems
                .reduce(
                  (acc, item) =>
                    acc +
                    (item.price - (item.price * item.discount) / 100) *
                      item.quantity,
                  0,
                )
                .toFixed(2)}
            </div>
            <Button className="mt-4 md:mt-0 w-full md:w-auto">Buy Now</Button>
          </div>
        </div>
      </div>
    </>
  );
}
