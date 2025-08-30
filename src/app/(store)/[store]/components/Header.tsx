"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { useCart } from "@/contexts/CartContext";

const Header = () => {
  //   const { state, dispatch } = useCart();

  //   const isActive = (path: string) => location.pathname === path;
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-serif font-semibold text-primary">
              Artisan
            </h1>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/shop") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Shop
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/contact") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Contact
            </Link>
            <Link
              href="/delivery"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/delivery") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Delivery
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="relative"
            //   onClick={() => dispatch({ type: "TOGGLE_CART" })}
            >
              <ShoppingCart className="h-5 w-5" />
              {/* {state.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.items.length}
                </span>
              )} */}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
