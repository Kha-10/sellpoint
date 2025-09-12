"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CreditCard,
  QrCode,
  Upload,
  ChevronLeft,
  ArrowRight,
  Trash2,
  Home,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCart } from "../providers/CartContext";
// import { useToast } from '@/hooks/use-toast';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatWithCurrency } from "@/helper/formatCurrency";
import { v4 as uuidv4 } from "uuid";
import { StoreData } from "@/lib/api";

// Validation schemas
const customerInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  deliveryAddress: z.object({
    fullAddress: z.string(),
  }),
});

const paymentInfoSchema = z
  .object({
    method: z.enum(["promptpay", "stripe", "cash"]),
    cardNumber: z.string().optional(),
    expiry: z.string().optional(),
    cvv: z.string().optional(),
    paymentSlip: z.any().optional(),
  })
  .refine(
    (data) => {
      console.log(data);

      if (data.method === "stripe") {
        return (
          data.cardNumber &&
          data.expiry &&
          data.cvv &&
          data.cardNumber.length >= 16 &&
          data.expiry.match(/^\d{2}\/\d{2}$/) &&
          data.cvv.length >= 3
        );
      }
      return true;
    },
    {
      message: "Please fill in all required card details",
      path: ["cardNumber"],
    }
  )
  .refine(
    (data) => {
      if (data.method === "promptpay") {
        return !!data.paymentSlip;
      }
      return true;
    },
    {
      message: "Payment slip is required",
      path: ["paymentSlip"],
    }
  );

type CustomerInfo = z.infer<typeof customerInfoSchema>;
type PaymentInfo = z.infer<typeof paymentInfoSchema>;

const Checkout = ({ storeData }: { storeData: StoreData }) => {
  const { state, dispatch } = useCart();
  const router = useRouter();
  // const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPaymentSlip, setSelectedPaymentSlip] = useState<File | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const customerForm = useForm<CustomerInfo>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      deliveryAddress: {
        fullAddress: "",
      },
    },
  });

  const paymentForm = useForm<PaymentInfo>({
    resolver: zodResolver(paymentInfoSchema),
    defaultValues: {
      method: "promptpay",
      cardNumber: "",
      expiry: "",
      cvv: "",
      paymentSlip: null,
    },
  });

  useEffect(() => {
    if (storeData.settings.payments.cash) {
      paymentForm.setValue("method", "cash");
    } else if (storeData.settings.payments.bank.enabled) {
      paymentForm.setValue("method", "stripe");
    } else if (storeData.settings.payments.promptPay.enabled) {
      paymentForm.setValue("method", "promptpay");
    }
  }, [storeData, paymentForm]);

  // const deliveryFee = 5.0;
  // const tax = state.total * 0.1;
  // const finalTotal = state.total + deliveryFee + tax;
  const total = state.items.reduce((acc, item) => acc + item.totalPrice, 0);
  // const finalTotal = total + deliveryFee;

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await customerForm.trigger();
      console.log(customerForm.formState.errors);

      if (isValid) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      const isValid = await paymentForm.trigger();
      if (isValid) {
        setCurrentStep(3);
      }
    }
  };

  function getOrCreateIdempotencyKey() {
    let cartId = sessionStorage.getItem("idempotencyKey");
    if (!cartId) {
      cartId = uuidv4();
      sessionStorage.setItem("idempotencyKey", cartId);
    }
    return cartId;
  }

  const handlePlaceOrder = async () => {
    const customerData = customerForm.getValues();
    const paymentData = paymentForm.getValues();

    const guestCartId = sessionStorage.getItem("guestCartId");

    const orderData = {
      customer: customerData,
      customerType: "guest",
      cartId: guestCartId,
      orderStatus: "Pending",
      items: state.items,
      pricing: {
        finalTotal: total,
      },
    };

    const idempotencyKey = getOrCreateIdempotencyKey();

    const headers = {
      "Idempotency-Key": idempotencyKey,
      "Content-Type": "application/json",
    };

    try {
      setLoading(true);
      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/public/stores/${storeData.slug}/orders`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(orderData),
      });
      const response = await res.json();
      if (!res.ok) {
        throw new Error(response.msg);
      }

      if (res.status === 200) {
        if (paymentData.method === "promptpay" && paymentData.paymentSlip) {
          const file = paymentData.paymentSlip;

          if (file) {
            const formData = new FormData();
            formData.append("photo", file);

            const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/public/stores/${storeData.slug}/orders/${response._id}/upload?type=receipt`;

            try {
              const uploadRes = await fetch(endpoint, {
                method: "POST",
                body: formData,
              });

              if (!uploadRes.ok) {
                throw new Error(
                  `Upload failed with status ${uploadRes.status}`
                );
              }

              const data = await uploadRes.json();
            } catch (err) {
              console.error("Upload error:", err);
            }
          }
        }
        sessionStorage.removeItem("guestCartId");
        sessionStorage.removeItem("idempotencyKey");
        dispatch({ type: "CLEAR_CART" });
        router.push(`/${storeData.slug}/orders/${response._id}/success`);
      }
    } catch (error: unknown) {
      setLoading(false);
      if (error instanceof Error) {
        console.error("getCateogryData error:", error.message);
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    sessionStorage.removeItem("idempotencyKey");
    router.push(`/${storeData.slug}`);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`
            w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
            ${
              currentStep >= step
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }
          `}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-1 mx-2 ${
                currentStep > step ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Customer Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...customerForm}>
          <form className="space-y-4">
            <FormField
              control={customerForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Full Name <span className="text-red-500 text-sm">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={customerForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email Address{" "}
                    <span className="text-red-500 text-sm">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={customerForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone Number <span className="text-red-500 text-sm">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={customerForm.control}
              name="deliveryAddress.fullAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Delivery Address{" "}
                    <span className="text-red-500 text-sm">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your full delivery address"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...paymentForm}>
          <form className="space-y-6">
            <FormField
              control={paymentForm.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="mb-6"
                    >
                      {storeData.settings.payments.cash && (
                        <div className="flex items-center space-x-2 p-4 border rounded-lg">
                          <RadioGroupItem value="cash" id="cash" />
                          <FormLabel
                            htmlFor="cash"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Banknote className="h-5 w-5" />
                            Cash on Delivery
                          </FormLabel>
                        </div>
                      )}
                      {storeData.settings.payments.promptPay.enabled && (
                        <div className="flex items-center space-x-2 p-4 border rounded-lg">
                          <RadioGroupItem value="promptpay" id="promptpay" />
                          <FormLabel
                            htmlFor="promptpay"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <QrCode className="h-5 w-5" />
                            PromptPay
                          </FormLabel>
                        </div>
                      )}
                      {storeData.settings.payments.bank.enabled && (
                        <div className="flex items-center space-x-2 p-4 border rounded-lg">
                          <RadioGroupItem value="stripe" id="stripe" />
                          <FormLabel
                            htmlFor="stripe"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <CreditCard className="h-5 w-5" />
                            Credit/Debit Card
                          </FormLabel>
                        </div>
                      )}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {paymentForm.watch("method") === "promptpay" && (
              <div className="text-center space-y-4">
                <div className="bg-muted p-6 rounded-lg">
                  <QrCode className="h-32 w-32 mx-auto text-muted-foreground mb-4" />
                  <p className="font-medium">
                    PromptPay Number :{" "}
                    {storeData.settings.payments.promptPay.phoneNumber}
                  </p>
                  <p className="text-2xl font-bold text-primary mt-2">
                    {formatWithCurrency(total, storeData.settings.currency)}
                  </p>
                </div>
                <FormField
                  control={paymentForm.control}
                  name="paymentSlip"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>Upload Payment Slip (required)</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50">
                              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Click to upload payment slip
                              </p>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  onChange(file);
                                  setSelectedPaymentSlip(file || null);
                                }}
                                {...field}
                              />
                            </label>
                          </div>
                          {selectedPaymentSlip && (
                            <div className="mt-4 flex justify-center">
                              <div className="text-center">
                                <p className="text-sm font-medium mb-2">
                                  Selected Payment Slip:
                                </p>
                                <div className="relative inline-block">
                                  <Image
                                    width={100}
                                    height={100}
                                    src={URL.createObjectURL(
                                      selectedPaymentSlip
                                    )}
                                    alt="Payment slip preview"
                                    className="object-contain rounded-lg  h-48 w-auto"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2 h-8 w-8 p-0"
                                    onClick={() => {
                                      setSelectedPaymentSlip(null);
                                      onChange(null);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {selectedPaymentSlip.name}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {paymentForm.watch("method") === "stripe" && (
              <div className="space-y-4">
                <FormField
                  control={paymentForm.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="1234 5678 9012 3456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={paymentForm.control}
                    name="expiry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date *</FormLabel>
                        <FormControl>
                          <Input placeholder="MM/YY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={paymentForm.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV *</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Review & Confirm Order</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Items */}
        <div>
          <h4 className="font-semibold mb-3">Order Items</h4>
          <div className="space-y-3">
            {state.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-2 border-b"
              >
                <div>
                  <p className="font-medium">{item.productName}</p>
                  {item.options.map((option, i) => (
                    <div
                      key={i}
                      className="text-xs text-muted-foreground mt-1 space-x-1 mb-1"
                    >
                      {option.name} :{" "}
                      {option.answers?.map((ans, idx) => (
                        <span key={idx} className="space-x-2 space-y-5">
                          {ans}{" "}
                          {option.prices?.[idx] !== undefined &&
                            formatWithCurrency(
                              option.prices[idx],
                              storeData.settings.currency
                            )}
                          {option.quantities?.[idx] !== undefined &&
                            ` x ${option.quantities[idx]}`}
                          {idx < option.answers!.length - 1 && ", "}
                        </span>
                      ))}
                    </div>
                  ))}
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">${item.totalPrice.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Info Summary */}
        <div>
          <h4 className="font-semibold mb-2">Delivery Information</h4>
          <p className="text-sm">{customerForm.getValues().name}</p>
          <p className="text-sm">{customerForm.getValues().email}</p>
          <p className="text-sm">{customerForm.getValues().phone}</p>
          <p className="text-sm">
            {customerForm.getValues().deliveryAddress.fullAddress}
          </p>
        </div>

        <Separator />

        {/* Payment Summary */}
        <div>
          <h4 className="font-semibold mb-2">Payment Method</h4>
          <p className="text-sm capitalize">
            {paymentForm.getValues().method === "promptpay"
              ? "PromptPay"
              : "Credit/Debit Card"}
          </p>
        </div>

        <Separator />

        {/* Total Summary */}
        <div className="space-y-2">
          {/* <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${state.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <Separator /> */}
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <h2 className="text-2xl font-serif font-bold mb-4">
              Cart is Empty
            </h2>
            <p className="text-muted-foreground mb-6">
              Add some items to your cart before checkout
            </p>
            <Button asChild>
              {/* <a href="/shop">Continue Shopping</a> */}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            <Button variant="ghost" size="icon" onClick={clearAll}>
              <Home className="h-7 w-7" />
            </Button>
            Checkout
          </h1>
          <p className="text-muted-foreground">
            Complete your order in 3 simple steps
          </p>
        </div>

        {renderStepIndicator()}

        <div className="space-y-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() =>
                currentStep > 1
                  ? setCurrentStep((prev) => prev - 1)
                  : router.push("/cart")
              }
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {currentStep > 1 ? "Previous" : "Back to Cart"}
            </Button>

            {currentStep < 3 ? (
              <Button type="button" onClick={handleNext}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                size="default"
                onClick={handlePlaceOrder}
                className="cursor-pointer"
              >
                {loading ? (
                  <svg
                    className="h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 01-8-8z"
                    />
                  </svg>
                ) : (
                  <>Place Order</>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
