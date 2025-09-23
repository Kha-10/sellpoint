"use client";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileNav({ isOpen, onToggle }: MobileNavProps) {
  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden"
        onClick={onToggle}
        aria-label="Toggle mobile menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onToggle}
          />

          {/* Menu panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-card border-l border-border shadow-lg">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="text-lg font-semibold">Menu</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Navigation links */}
              <nav className="flex-1 p-4 space-y-4">
                <a
                  href="#features"
                  className="block py-3 text-lg text-muted-foreground hover:text-foreground transition-colors"
                  onClick={onToggle}
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="block py-3 text-lg text-muted-foreground hover:text-foreground transition-colors"
                  onClick={onToggle}
                >
                  Pricing
                </a>
                <a
                  href="#testimonials"
                  className="block py-3 text-lg text-muted-foreground hover:text-foreground transition-colors"
                  onClick={onToggle}
                >
                  Testimonials
                </a>
              </nav>

              {/* Action buttons */}
              <div className="p-4 space-y-3 border-t border-border">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={onToggle}
                >
                  Sign In
                </Button>
                <Button className="w-full" onClick={onToggle}>
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
