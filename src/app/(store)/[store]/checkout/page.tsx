"use client"
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { CreditCard, QrCode, Upload, ChevronLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/app/(store)/[store]/providers/CartContext';
// import { useToast } from '@/hooks/use-toast';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface PaymentInfo {
  method: 'promptpay' | 'stripe';
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  paymentSlip?: File;
}

const Checkout = () => {
  const { state, dispatch } = useCart();
  // const navigate = useNavigate();
  // const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: 'promptpay'
  });

  const deliveryFee = 5.00;
  // const tax = state.total * 0.1;
  // const finalTotal = state.total + deliveryFee + tax;

  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentInfoChange = (field: keyof PaymentInfo, value: any) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      return customerInfo.name && customerInfo.email && customerInfo.phone && customerInfo.address;
    }
    if (step === 2) {
      if (paymentInfo.method === 'stripe') {
        return paymentInfo.cardNumber && paymentInfo.expiry && paymentInfo.cvv;
      }
      return true; // PromptPay doesn't require validation at this step
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      // toast({
      //   title: "Missing Information",
      //   description: "Please fill in all required fields",
      //   variant: "destructive"
      // });
    }
  };

  const handlePlaceOrder = () => {
    const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Clear cart and navigate to success page
    dispatch({ type: 'CLEAR_CART' });
    // navigate('/order-success', { 
    //   state: { 
    //     orderId, 
    //     customerInfo, 
    //     paymentInfo, 
    //     orderTotal: finalTotal,
    //     items: state.items 
    //   } 
    // });
    
    // toast({
    //   title: "Order Placed Successfully!",
    //   description: `Order #${orderId} has been confirmed`,
    // });
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
            ${currentStep >= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
          `}>
            {step}
          </div>
          {step < 3 && (
            <div className={`w-16 h-1 mx-2 ${currentStep > step ? 'bg-primary' : 'bg-muted'}`} />
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
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={customerInfo.name}
            onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={customerInfo.email}
            onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={customerInfo.phone}
            onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>
        <div>
          <Label htmlFor="address">Delivery Address *</Label>
          <Textarea
            id="address"
            value={customerInfo.address}
            onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
            placeholder="Enter your full delivery address"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={paymentInfo.method}
          onValueChange={(value) => handlePaymentInfoChange('method', value)}
          className="mb-6"
        >
          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <RadioGroupItem value="promptpay" id="promptpay" />
            <Label htmlFor="promptpay" className="flex items-center gap-2 cursor-pointer">
              <QrCode className="h-5 w-5" />
              PromptPay
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <RadioGroupItem value="stripe" id="stripe" />
            <Label htmlFor="stripe" className="flex items-center gap-2 cursor-pointer">
              <CreditCard className="h-5 w-5" />
              Credit/Debit Card
            </Label>
          </div>
        </RadioGroup>

        {paymentInfo.method === 'promptpay' && (
          <div className="text-center space-y-4">
            <div className="bg-muted p-6 rounded-lg">
              <QrCode className="h-32 w-32 mx-auto text-muted-foreground mb-4" />
              <p className="font-medium">PromptPay Number: 012-345-6789</p>
              {/* <p className="text-2xl font-bold text-primary mt-2">${finalTotal.toFixed(2)}</p> */}
            </div>
            <div>
              <Label htmlFor="payment-slip">Upload Payment Slip (Optional)</Label>
              <div className="mt-2 flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload payment slip</p>
                  <input
                    id="payment-slip"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handlePaymentInfoChange('paymentSlip', e.target.files?.[0])}
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {paymentInfo.method === 'stripe' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number *</Label>
              <Input
                id="cardNumber"
                value={paymentInfo.cardNumber || ''}
                onChange={(e) => handlePaymentInfoChange('cardNumber', e.target.value)}
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date *</Label>
                <Input
                  id="expiry"
                  value={paymentInfo.expiry || ''}
                  onChange={(e) => handlePaymentInfoChange('expiry', e.target.value)}
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  value={paymentInfo.cvv || ''}
                  onChange={(e) => handlePaymentInfoChange('cvv', e.target.value)}
                  placeholder="123"
                />
              </div>
            </div>
          </div>
        )}
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
              <div key={item.id} className="flex justify-between items-center py-2 border-b">
                <div>
                  {/* <p className="font-medium">{item.product.name}</p> */}
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">${item.totalPrice.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Customer Info Summary */}
        <div>
          <h4 className="font-semibold mb-2">Delivery Information</h4>
          <p className="text-sm">{customerInfo.name}</p>
          <p className="text-sm">{customerInfo.email}</p>
          <p className="text-sm">{customerInfo.phone}</p>
          <p className="text-sm">{customerInfo.address}</p>
        </div>

        <Separator />

        {/* Payment Summary */}
        <div>
          <h4 className="font-semibold mb-2">Payment Method</h4>
          <p className="text-sm capitalize">{paymentInfo.method === 'promptpay' ? 'PromptPay' : 'Credit/Debit Card'}</p>
        </div>

        <Separator />

        {/* Total Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            {/* <span>${state.total.toFixed(2)}</span> */}
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            {/* <span>${tax.toFixed(2)}</span> */}
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            {/* <span>${finalTotal.toFixed(2)}</span> */}
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
            <h2 className="text-2xl font-serif font-bold mb-4">Cart is Empty</h2>
            <p className="text-muted-foreground mb-6">Add some items to your cart before checkout</p>
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
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Checkout</h1>
          <p className="text-muted-foreground">Complete your order in 3 simple steps</p>
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
              // onClick={() => currentStep > 1 ? setCurrentStep(prev => prev - 1) : navigate('/cart')}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {currentStep > 1 ? 'Previous' : 'Back to Cart'}
            </Button>

            {currentStep < 3 ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handlePlaceOrder}
                className="bg-success hover:bg-success/90"
              >
                Place Order
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;