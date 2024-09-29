"use client";

import CartCard from "@/components/cart/CartCard";
import NotFound from "@/components/shared/not-found";
import { Button } from "@/components/ui/button";
import Title from "@/components/ui/title";
import useStore from "@/hooks/use-store";
import CartShimmer from "@/shimmer/cart-shimmer";

export default function Cart() {
  const { cartItems, totalAmount, refetchCartData, isCartLoading } = useStore();

  return (
    <>
      <Title title="Cart" />
      <div className="grid grid-rows-[calc(100vh-210px)_1fr] md:grid-rows-[calc(100vh-180px)_1fr] grid-cols-1">
        {!isCartLoading && cartItems?.length > 0 && (
          <div className="mt-4 overflow-y-scroll">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cartItems.map((cart) => (
                <CartCard cart={cart} getCartData={refetchCartData} />
              ))}
            </div>
          </div>
        )}
        {isCartLoading && <CartShimmer />}
        {!isCartLoading && cartItems.length === 0 && <NotFound />}
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
