import Link from "next/link";
import { ArrowRight, Leaf, Award, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/app/(store)/[store]/components/ProductCard";
import { products } from "@/app/(store)/[store]/data/products";

const Home = async () => {
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-secondary/20 to-accent/30">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">
            Premium Artisan
            <span className="block text-primary">Products</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover our carefully curated collection of the finest artisan
            foods, sourced directly from passionate producers who share our
            commitment to quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              <Link href="/shop">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">Learn Our Story</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-product">
              <CardContent className="pt-8 pb-8">
                <Leaf className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-serif font-semibold mb-2">
                  Natural & Pure
                </h3>
                <p className="text-muted-foreground text-sm">
                  All our products are sourced from organic farms and artisan
                  producers who prioritize quality over quantity.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-product">
              <CardContent className="pt-8 pb-8">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-serif font-semibold mb-2">
                  Award Winning
                </h3>
                <p className="text-muted-foreground text-sm">
                  Our curated selection features products that have been
                  recognized for their exceptional quality and taste.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-product">
              <CardContent className="pt-8 pb-8">
                <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-serif font-semibold mb-2">
                  Fast Delivery
                </h3>
                <p className="text-muted-foreground text-sm">
                  Fresh products delivered straight to your door with our
                  temperature-controlled shipping.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground">
              Handpicked favorites from our artisan collection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/shop">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
