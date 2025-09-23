import { ShoppingCart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/40 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Sellpoint</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The complete platform for building and managing your online store.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-foreground transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-foreground transition-colors">
                  Testimonials
                </a>
              </li>
              <li>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">
              Contact information
            </h3>
            <p className="text-muted-foreground italic text-sm">
              Bangkok, Thailand
            </p>
            <p className="text-muted-foreground text-sm mt-1">+66 0629474106</p>
            <p className="text-muted-foreground text-sm">nexoradigital.site</p>
          </div>
          
          {/* <div>
            <h3 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">
              Sign up for updates
            </h3>
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
            <div className="flex space-x-4 mt-4 md:mt-6">
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div> */}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-6 md:mt-8 pt-4 md:pt-6 text-center">
          <p className="text-muted-foreground text-xs md:text-sm">
            © {new Date().getFullYear()}, Nexora Digital
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
