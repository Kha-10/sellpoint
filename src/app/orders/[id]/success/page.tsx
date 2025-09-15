import { CheckCircle, Package, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { getSingleOrderData, getStoreData } from "@/lib/api";
import { formatWithCurrency } from "@/helper/formatCurrency";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { headers } from "next/headers";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const parts = host.split(".");
  const subdomain = parts[0];
  const storeData = await getStoreData(subdomain);

  if (!storeData) {
    return {
      title: "Order Success - Store Not Found",
      description:
        "This store could not be found. Please check the URL or visit our homepage.",
    };
  }

  return {
    title: `Order # ${id} - ${storeData.name} | Sell Point`,
    description: `Thank you for shopping at ${storeData.name}. Your order has been placed successfully.`,
    openGraph: {
      title: `Order Success – ${storeData.name}`,
      description: `Your order at ${storeData.name} was placed successfully.`,
      url: `${process.env.NEXT_DOMAIN}/${storeData.slug}/checkout`,
    },
  };
}

export default async function OrderSuccess({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const parts = host.split(".");
  const subdomain = parts[0];
  const storeData = await getStoreData(subdomain);
  if (!storeData) notFound();

  const { data, error } = await getSingleOrderData(id, subdomain);

  if (error) {
    console.error(error);
  } else {
    console.log(data);
  }

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
              <Link href={`/`}>Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return <p>No order data</p>;

  if (error) {
    return <p>{error}</p>;
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
                    #{data?.orderNumber}
                  </span>
                </div>

                <Separator />

                {/* Order Items */}
                <div>
                  <h4 className="font-semibold mb-3">Items Ordered:</h4>
                  <div className="space-y-2">
                    {data?.items?.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center text-sm"
                      >
                        <div>
                          <span className="font-medium">
                            {item.productName}
                          </span>
                          <span className="text-muted-foreground ml-2">
                            x{item.quantity}
                          </span>
                          {item.options.map((option, i) => (
                            <div
                              key={i}
                              className="text-xs text-muted-foreground mt-1 space-x-1 mb-1"
                            >
                              {option.name} :{" "}
                              {Array.isArray(option.answers) &&
                                option.answers.map((ans, idx) => (
                                  <span
                                    key={idx}
                                    className="space-x-2 space-y-5"
                                  >
                                    {ans}{" "}
                                    {option.prices?.[idx] !== undefined &&
                                      formatWithCurrency(
                                        option.prices[idx],
                                        storeData.settings.currency
                                      )}
                                    {option.quantities?.[idx] !== undefined &&
                                      ` x ${option.quantities[idx]}`}
                                    {idx < option.answers.length - 1 && ", "}
                                  </span>
                                ))}
                            </div>
                          ))}
                        </div>
                        <span className="font-semibold">
                          {formatWithCurrency(
                            item.totalPrice,
                            storeData?.settings?.currency
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Paid:</span>
                  <span className="text-primary">
                    {formatWithCurrency(
                      data.pricing.finalTotal,
                      storeData?.settings?.currency
                    )}
                  </span>
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
                <p>
                  <strong>Name:</strong>{" "}
                  {(data.customer && data.customer.name) ||
                    data.manualCustomer.name}
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {(data.customer && data.customer.phone) ||
                    data.manualCustomer.phone}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {(data.customer && data.customer.email) ||
                    data.manualCustomer.email}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {data.customer?.deliveryAddress?.street}
                  {data.customer?.deliveryAddress?.city}
                  {data.customer?.deliveryAddress?.apartment}
                  {data.customer?.deliveryAddress?.zipCode}
                  {data.manualCustomer?.deliveryAddress?.street}
                  {data.manualCustomer?.deliveryAddress?.city}
                  {data.manualCustomer?.deliveryAddress?.apartment}
                  {data.manualCustomer?.deliveryAddress?.zipCode ||
                    data.manualCustomer?.deliveryAddress?.fullAddress}
                </p>
                {/* <p>
                  <strong>Payment Method:</strong>{" "}
                  {paymentInfo?.method === "promptpay"
                    ? "PromptPay"
                    : "Credit/Debit Card"}
                </p> */}
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
                      {storeData.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Email Support</p>
                    {storeData.email && (
                      <p className="text-sm text-muted-foreground">
                        {storeData.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Status */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="font-serif text-lg font-semibold mb-2">
                  What&apos;s Next?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We&apos;ll send you an email confirmation shortly.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button asChild variant="outline">
                    <Link href={`/search`}>
                      Continue Shopping
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/`}>Return Home</Link>
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
