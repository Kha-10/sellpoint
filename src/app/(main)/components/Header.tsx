"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Sell Point
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Testimonials
              </a>
              <Button asChild variant="outline" size="sm">
                <a
                  href={process.env.NEXT_PUBLIC_ADMIN_DOMAIN}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sign In
                </a>
              </Button>
              <Button asChild size="sm">
                <a
                  href={process.env.NEXT_PUBLIC_ADMIN_DOMAIN_SIGNUP}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Started
                </a>
              </Button>
            </div>
            <MobileNav isOpen={isMobileMenuOpen} onToggle={toggleMobileMenu} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
