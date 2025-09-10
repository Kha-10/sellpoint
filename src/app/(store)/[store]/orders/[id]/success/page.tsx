import { CheckCircle, Package, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default async function OrderSuccess({
  params,
}: {
  params: Promise<{ store: string; id: string }>;
}) {
  const { store, id } = await params;

  if (!id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <h2 className="text-2xl font-serif font-bold mb-4">
              Order Not Found
            </h2>
            <p className="text-muted-foreground mb-6">
              We couldnt find your order details
            </p>
            <Button asChild>
              <Link href={`/${store}`}>Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Thank You for Your Order!
          </h1>
          <p className="text-lg text-muted-foreground">
            Your order has been successfully placed and is being processed.
          </p>
        </div>

        {/* Order Details */}
        <div className="space-y-6">
          {/* Order Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Order Number:</span>
                  <span className="text-lg font-mono font-bold text-primary">
                    #{1}
                  </span>
                </div>

                <Separator />

                {/* Order Items */}
                <div>
                  <h4 className="font-semibold mb-3">Items Ordered:</h4>
                  <div className="space-y-2">
                    {/* {items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div>
                          <span className="font-medium">{item.product.name}</span>
                          <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-semibold">${item.totalPrice.toFixed(2)}</span>
                      </div>
                    ))} */}
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Paid:</span>
                  {/* <span className="text-primary">${orderTotal?.toFixed(2)}</span> */}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {/* <p><strong>Name:</strong> {customerInfo?.name}</p>
                <p><strong>Phone:</strong> {customerInfo?.phone}</p>
                <p><strong>Email:</strong> {customerInfo?.email}</p>
                <p><strong>Address:</strong> {customerInfo?.address}</p>
                <p><strong>Payment Method:</strong> {paymentInfo?.method === 'promptpay' ? 'PromptPay' : 'Credit/Debit Card'}</p> */}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about your order, please dont hesitate
                to contact us.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Phone Support</p>
                    <p className="text-sm text-muted-foreground">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Email Support</p>
                    <p className="text-sm text-muted-foreground">
                      support@artisan.com
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Status */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center">
                {/* <h3 className="font-serif text-lg font-semibold mb-2">What's Next?</h3> */}
                {/* <p className="text-sm text-muted-foreground mb-4">
                  We'll send you an email confirmation shortly with tracking information. 
                  Your artisan products will be carefully prepared and delivered within 2-3 business days.
                </p> */}
                <div className="flex gap-3 justify-center">
                  <Button asChild variant="outline">
                    {/* <Link to="/shop">Continue Shopping</Link> */}
                  </Button>
                  <Button asChild>
                    {/* <Link to="/">Return Home</Link> */}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
