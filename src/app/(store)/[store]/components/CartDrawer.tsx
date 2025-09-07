import { X, Plus, Minus, Trash2 } from "lucide-react";
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
  console.log("items", state.items);

  if (!state.isOpen) return null;

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch({ type: "REMOVE_ITEM", payload: id });
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id, quantity: newQuantity },
      });
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
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
                      <Image
                        width={20}
                        height={20}
                        src={item.imgUrls![0]}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
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
                              {ans}
                              {option.prices?.[idx] !== undefined &&
                                ` ${option.prices[idx]}`}
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
                              handleUpdateQuantity(item.id, item.quantity - 1)
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
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={() =>
                            dispatch({ type: "REMOVE_ITEM", payload: item.id })
                          }
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      <p className="text-sm font-medium mt-1">
                        ${item.totalPrice.toFixed(2)}
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
