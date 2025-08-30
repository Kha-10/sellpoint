import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instagram, Youtube, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border mt-8 md:mt-16">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">Quick links</h3>
            <div className="space-y-1 md:space-y-2">
              <p className="text-muted-foreground hover:text-primary cursor-pointer text-sm transition-colors">Search</p>
              <p className="text-muted-foreground hover:text-primary cursor-pointer text-sm transition-colors">Shop</p>
              <p className="text-muted-foreground hover:text-primary cursor-pointer text-sm transition-colors">Contact</p>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">Contact information</h3>
            <p className="text-muted-foreground italic text-sm">Buriram, Isan, Thailand</p>
            <p className="text-muted-foreground text-sm mt-1">+66 123 456 789</p>
            <p className="text-muted-foreground text-sm">info@buriramfood.com</p>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">Sign up for updates</h3>
            <div className="flex flex-col md:flex-row gap-2 md:gap-0">
              <Input 
                type="email" 
                placeholder="Email" 
                className="md:rounded-r-none text-sm"
              />
              <Button 
                type="submit" 
                className="md:rounded-l-none h-9"
                variant="default"
                size="sm"
              >
                Subscribe
              </Button>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4 mt-4 md:mt-6">
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-6 md:mt-8 pt-4 md:pt-6 text-center">
          <p className="text-muted-foreground text-xs md:text-sm">
            © {new Date().getFullYear()}, Buriram Expat Food and Drink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;