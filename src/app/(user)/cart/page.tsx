"use client";

import CartCard from "@/components/cart/CartCard";
import NotFound from "@/components/shared/not-found";
import { Button } from "@/components/ui/button";
import Title from "@/components/ui/title";
import { getCartFn } from "@/services/cart";
import { showAlert } from "@/services/handle-api";
import CartShimmer from "@/shimmer/cart-shimmer";
import { CartModType } from "@/types/cart-types";
import { useEffect, useState } from "react";

export default function Cart() {
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartModType[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const getCartData = () => {
    getCartFn().then((data) => {
      setCartItems(data?.data?.mods || []);
      setTotalAmount(data?.data?.totalAmount.toFixed(0));
      setLoading(false);
    });
  };

  useEffect(() => {
    getCartData();
  }, []);

  return (
    <>
      <Title title="Cart" />
      <div className="grid grid-rows-[calc(100vh-210px)_1fr] md:grid-rows-[calc(100vh-180px)_1fr] grid-cols-1">
        {!loading && cartItems?.length > 0 && (
          <div className="mt-4 overflow-y-scroll">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cartItems.map((cart) => (
                <CartCard cart={cart} getCartData={getCartData} />
              ))}
            </div>
          </div>
        )}
        {loading && <CartShimmer />}
        {!loading && cartItems.length === 0 && <NotFound />}
        {totalAmount > 0 && (
          <div className="p-4 rounded-lg bg-card mt-4 mr-1">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-xl font-bold">
                Total Amount: ₹{totalAmount}
              </div>
              <Button className="mt-4 md:mt-0 w-full md:w-auto">Buy Now</Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
