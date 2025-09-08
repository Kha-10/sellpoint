import { useEffect } from "react";
import { X, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/app/(store)/[store]/providers/CartContext";
import Image from "next/image";
import { formatWithCurrency } from "@/helper/formatCurrency";
import { useLayout } from "../contexts/LayoutContext";

const CartDrawer = () => {
  const { state, dispatch } = useCart();
  const { storeData } = useLayout();

  const handleUpdateQuantity = async (
    productId: string,
    variantId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;
    try {
      const cartId = sessionStorage.getItem("guestCartId");
      if (!cartId) throw new Error("Missing guestCartId");
      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/public/stores/${storeData.slug}/cart/${cartId}`;
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          variantId,
          quantity: newQuantity,
        }),
      });
      if (res.status === 200) {
        const response = await res.json();
        console.log("response", response);

        if (response.cart) {
          const data = response.cart.items;
          dispatch({
            type: "ADD_ITEM",
            payload: data,
          });
        }
      }
    } catch (error) {
      console.error("❌ Failed to sync with Redis:", error);
    }
  };

  const removeFromCart = async (
    productId: string,
    variantId: string,
    id: string
  ) => {
    const cartId = sessionStorage.getItem("guestCartId");
    if (!cartId) throw new Error("Missing guestCartId");

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/public/stores/${
        storeData.slug
      }/cart/${cartId}/item/${id}/${productId}/${variantId ?? ""}`;
      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 200) {
        const response = await res.json();
        console.log("response", response);

        if (response.cartDeleted) {
          dispatch({ type: "CLEAR_CART" });
          sessionStorage.removeItem("guestCartId");
        } else {
          const data = response.cart.items;
          dispatch({
            type: "ADD_ITEM",
            payload: data,
          });
        }
      }
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    }
  };

  useEffect(() => {
    const cartId = sessionStorage.getItem("guestCartId");
    if (!cartId) return;

    const getCartData = async (cartId: string) => {
      try {
        const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/public/stores/${storeData.slug}/cart/${cartId}`;
        const res = await fetch(endpoint);
        if (res.status === 200) {
          const response = await res.json();
          console.log("response", response);
          if (response.items) {
            const data = response.items;
            dispatch({
              type: "ADD_ITEM",
              payload: data,
            });
          }
        }
      } catch (error) {
        console.error("❌ Failed to sync with Redis:", error);
      }
    };

    getCartData(cartId);
  }, [dispatch, storeData]);

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 transition-opacity"
        onClick={() => dispatch({ type: "CLOSE_CART" })}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 shadow-elevated transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-serif font-semibold">Your Cart</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch({ type: "CLOSE_CART" })}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Your cart is empty</p>
                <Button
                  variant="outline"
                  onClick={() => dispatch({ type: "CLOSE_CART" })}
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {state.items.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary/50">
                      {(item.imgUrls?.length ?? 0) > 0 && (
                        <Image
                          width={20}
                          height={20}
                          src={item.imgUrls![0]}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {item?.imgUrls?.length === 0 && (
                        <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center mb-3">
                          <ShoppingCart className="h-6 w-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {item.productName}
                      </h4>

                      {/* Selected options */}
                      {item.options.map((option, i) => (
                        <div
                          key={i}
                          className="text-xs text-muted-foreground mt-1 space-x-1 mb-1"
                        >
                          {option.name} :{" "}
                          {option.answers?.map((ans, idx) => (
                            <span key={idx} className="space-x-2 space-y-5">
                              {ans}{" "}
                              {option.prices?.[idx] !== undefined &&
                                formatWithCurrency(
                                  option.prices[idx],
                                  storeData.settings.currency
                                )}
                              {option.quantities?.[idx] !== undefined &&
                                ` x ${option.quantities[idx]}`}
                              {idx < option.answers!.length - 1 && ", "}
                            </span>
                          ))}
                        </div>
                      ))}

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                item.variantId,
                                item.quantity - 1
                              )
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                item.variantId,
                                item.quantity + 1
                              )
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          //   onClick={() =>
                          //     dispatch({ type: "REMOVE_ITEM", payload: item.id })
                          //   }
                          onClick={() =>
                            removeFromCart(
                              item.productId,
                              item.variantId,
                              item.id
                            )
                          }
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      <p className="text-sm font-medium mt-2">
                        {formatWithCurrency(
                          item.totalPrice,
                          storeData.settings.currency
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-border p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-serif font-semibold">Total</span>
                <span className="text-lg font-bold text-primary">
                  {formatWithCurrency(
                    state.items.reduce((acc, item) => acc + item.totalPrice, 0),
                    storeData.settings.currency
                  )}
                </span>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button variant="default" className="w-full" asChild>
                  <Link
                    href="/checkout"
                    onClick={() => dispatch({ type: "CLOSE_CART" })}
                  >
                    Checkout
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link
                    href="/cart"
                    onClick={() => dispatch({ type: "CLOSE_CART" })}
                  >
                    View Cart
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => dispatch({ type: "CLOSE_CART" })}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
