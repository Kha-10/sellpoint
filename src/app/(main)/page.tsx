"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, BarChart3, Globe, Star, Users, Zap } from "lucide-react";

const page = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                  Power Your Business with{" "}
                  <span className="text-primary">Your Own Online Store</span>
                </h1>
                <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                  Create a complete e-commerce solution with an admin dashboard
                  and client storefront. Launch your online business in minutes,
                  not months.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <a
                    href={process.env.NEXT_PUBLIC_ADMIN_DOMAIN_SIGNUP}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Started
                  </a>
                </Button>
                {/* <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 bg-transparent"
                >
                  Book a Demo
                </Button> */}
              </div>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>forever free for first 10 users</span>
                </div>
                {/* <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Cancel anytime</span>
                </div> */}
              </div>
            </div>
            <div className="relative">
              <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Dashboard Overview
                    </h3>
                    {/* <Badge variant="secondary">Live</Badge> */}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/10 rounded-lg p-4">
                      <div className="text-2xl font-bold text-primary">
                        $12,450
                      </div>
                      <div className="text-sm text-muted-foreground">Sales</div>
                    </div>
                    <div className="bg-accent/10 rounded-lg p-4">
                      <div className="text-2xl font-bold text-accent">
                        1,234
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Orders
                      </div>
                    </div>
                  </div>
                  <div className="h-32 bg-muted/20 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-16 h-16 text-muted-foreground/40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance">
              Everything you need to run your online store
            </h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              From inventory management to customer analytics, we&apos;ve got
              you covered with enterprise-grade features.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Admin Dashboard</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Comprehensive analytics, inventory management, and order
                  processing in one powerful dashboard.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Custom Storefront</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Beautiful, responsive storefronts that convert visitors into
                  customers with optimized checkout flows.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Sell Products Easily</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Add products, manage variants, set pricing, and handle
                  fulfillment with our intuitive tools.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Custom Domain Feature */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-balance">
                Each client gets their own branded store
              </h2>
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                Every customer receives a unique, branded storefront with their
                own pathname under the platform. Build trust and credibility
                with professional URLs that reflect their brand.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span>
                    Unique store pathnames(e.g.,nexoradigital.net/brandname)
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span>SSL certificates included</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span>White-label solution</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1 bg-muted rounded px-3 py-1 text-sm text-muted-foreground">
                      www.nexoradigital.site/shop1
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Boutique Fashion Store
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1 bg-muted rounded px-3 py-1 text-sm text-muted-foreground">
                      www.nexoradigital.site/shop2
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Tech Gadgets Hub
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1 bg-muted rounded px-3 py-1 text-sm text-muted-foreground">
                      www.nexoradigital.site/shop3
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Artisan Crafts Market
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance">
              Trusted by business owners worldwide
            </h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              See how entrepreneurs are growing their businesses with our
              platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 space-y-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  &ldquo;StoreBuilder transformed my small business. I went from
                  zero online presence to $50k monthly revenue in just 6
                  months.&ldquo;
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Sarah Chen</div>
                    <div className="text-sm text-muted-foreground">
                      Fashion Boutique Owner
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 space-y-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  &ldquo;The admin dashboard gives me complete control over my
                  inventory and orders. Customer support is exceptional
                  too.&ldquo;
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold">Marcus Rodriguez</div>
                    <div className="text-sm text-muted-foreground">
                      Electronics Retailer
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 space-y-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  &ldquo;Setting up my online store was incredibly easy. The
                  custom domain feature makes my business look so
                  professional.&ldquo;
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Emma Thompson</div>
                    <div className="text-sm text-muted-foreground">
                      Handmade Crafts
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Choose the plan that fits your business needs. All plans include
              our core features.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Starter</h3>
                  <div className="text-3xl font-bold">
                    $29
                    <span className="text-lg text-muted-foreground">
                      /month
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    Perfect for small businesses
                  </p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Up to 100 products</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Custom domain</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Basic analytics</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Email support</span>
                  </li>
                </ul>
                <Button className="w-full">Start Free Trial</Button>
              </CardContent>
            </Card>
            <Card className="border-primary/50 bg-primary/5 backdrop-blur-sm relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Business</h3>
                  <div className="text-3xl font-bold">
                    $79
                    <span className="text-lg text-muted-foreground">
                      /month
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    For growing businesses
                  </p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Up to 1,000 products</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Custom domain</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Advanced analytics</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Priority support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Marketing tools</span>
                  </li>
                </ul>
                <Button className="w-full">Start Free Trial</Button>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Enterprise</h3>
                  <div className="text-3xl font-bold">
                    $199
                    <span className="text-lg text-muted-foreground">
                      /month
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    For large-scale operations
                  </p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Unlimited products</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Custom domain</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Enterprise analytics</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">24/7 phone support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">API access</span>
                  </li>
                </ul>
                <Button className="w-full">Start Free Trial</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
