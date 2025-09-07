"use client";

import React from "react";
import { useCart, CartItem } from "@/app/(store)/[store]/providers/CartContext";
import { ChevronLeft, Plus, Minus, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Product } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import Image from "next/image";
// import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Option, Variant } from "@/app/(store)/[store]/providers/CartContext";
import { formatWithCurrency } from "@/helper/formatCurrency";
import { StoreData } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormSchema, validateForm, FormValues } from "@/lib/validation";
import { DevTool } from "@hookform/devtools";

const defaultValuesFromProduct = (product: Product): FormValues => ({
  variantId: "",
  quantity: 1,
  options:
    product?.options?.map((opt) => ({
      name: opt.name,
      answers: [],
      prices: [],
      quantities: [],
    })) || [],
});

const ProductDetail = ({
  storeData,
  product,
}: {
  storeData?: StoreData;
  product: Product;
}) => {
  const { dispatch } = useCart();

  const schema = validateForm(product);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValuesFromProduct(product),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    let total = 0;

    const variant = product.variants?.find((v) => v._id === data.variantId);
    if (variant) total += variant.price;

    data.options.forEach((opt) => {
      opt.prices!.forEach((p, i) => {
        const qty = opt.quantities?.[i] ?? 1;
        total += p * qty;
      });
    });

    total = total * data.quantity;

    // Pricing calculation
    const basePrice =
      variant?.price ?? product.price ?? product.originalPrice ?? 0;

    const cartId = sessionStorage.getItem("guestCartId");
    const cartItem: CartItem = {
      cartId,
      items: {
        cartMinimum: product?.cartMinimum,
        cartMaximum: product?.cartMaximum,
        categories: product!.categories,
        imgUrls: product?.imgUrls,
        options: data.options,
        productId: product._id!,
        trackQuantityEnabled: product.trackQuantityEnabled,
        productName: variant?.name
          ? `${product.name} - ${variant.name}`
          : product.name,
        photo: product?.photo,
        productinventory: product!.inventory!.quantity,
        basePrice,
        totalPrice: total,
        quantity: data.quantity,
        variantId: data.variantId!,
      },
      basePrice,
      totalPrice: total,
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/public/stores/${storeData?.slug}/cart`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItem),
      }
    );
    if (res.status === 200) {
      const response = await res.json();
      console.log("response", response.cart.items);
      sessionStorage.setItem("guestCartId", response.cart.id);
      const data = response.cart.items;
      dispatch({
        type: "ADD_ITEM",
        payload: data,
      });
      dispatch({ type: "OPEN_CART" });
    }
  };

  console.log("product", product);

  const renderVariatnt = (variant: Variant) => {
    return (
      <div key={variant._id} className="space-y-3">
        <FormField
          control={form.control}
          name="variantId"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <FormItem
                    key={variant._id}
                    className="flex items-center space-x-2"
                  >
                    <FormControl>
                      <RadioGroupItem value={variant._id} id={variant._id} />
                    </FormControl>
                    <FormLabel
                      htmlFor={variant._id}
                      className="flex-1 flex justify-between"
                    >
                      <div className="flex items-center space-x-6">
                        <span>{variant.name}</span>
                        {/* {product.inventory!.quantity <= 5 && (
                          <Badge variant="secondary">
                            {product.inventory!.quantity} left
                          </Badge>
                        )} */}
                      </div>
                      <span className="text-muted-foreground">
                        {formatWithCurrency(
                          variant.price ?? variant.originalPrice ?? 0,
                          storeData?.settings?.currency ?? "USD"
                        )}
                      </span>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              {/* <FormMessage /> */}
            </FormItem>
          )}
        />
      </div>
    );
  };

  const renderOption = (option: Option, index: number) => {
    return (
      <FormField
        key={option.name}
        control={form.control}
        name={`options.${index}.answers`} // bind to the answers array of this option
        render={({ field }): React.ReactElement => {
          const quantitiesPath = `options.${index}.quantities` as const;
          const pricesPath = `options.${index}.prices` as const;

          const getQuantities = () => form.getValues(quantitiesPath) || [];
          const setQuantities = (next: number[]) =>
            form.setValue(quantitiesPath, next, { shouldValidate: true });

          const getPrices = () => form.getValues(pricesPath) || [];
          const setPrices = (next: number[]) =>
            form.setValue(pricesPath, next, { shouldValidate: true });

          const currentAnswer = field.value?.[0];
          const currentQuantity = form.watch(quantitiesPath)?.[0] ?? 1;

          switch (option.type) {
            case "Selection":
              return (
                <FormItem className="space-y-3">
                  <FormLabel>
                    {option.name}{" "}
                    {option.required && (
                      <span className="text-destructive">*</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={currentAnswer?.toString() || ""}
                      onValueChange={(val) => {
                        field.onChange([val]);

                        const selectedChoice = option.settings?.choices?.find(
                          (c) => c.name === val
                        );

                        // reset quantity + set price
                        setQuantities([1]);
                        setPrices([selectedChoice?.amount ?? 0]);
                      }}
                    >
                      {option.settings?.choices?.map((choice) => {
                        const isSelected = currentAnswer === choice.name;

                        return (
                          <FormItem
                            key={choice.name}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-2 py-2">
                              <FormControl>
                                <RadioGroupItem
                                  value={choice.name}
                                  id={`${option.name}-${choice.name}`}
                                />
                              </FormControl>
                              <FormLabel
                                htmlFor={`${option.name}-${choice.name}`}
                                className="flex-1"
                              >
                                {choice.name}
                              </FormLabel>
                            </div>

                            <div className="flex items-center space-x-4">
                              {option.settings?.enableQuantity &&
                                isSelected && (
                                  <Select
                                    value={currentQuantity.toString()}
                                    onValueChange={(val) => {
                                      setQuantities([Number(val)]);
                                    }}
                                  >
                                    <SelectTrigger
                                      size="sm"
                                      className="w-[60px] border-gray-300"
                                    >
                                      <SelectValue placeholder="1" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[180px]">
                                      {Array.from({ length: 10 }, (_, i) => {
                                        const value = (i + 1).toString();
                                        return (
                                          <SelectItem key={value} value={value}>
                                            {value}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                )}
                              {/* Price */}
                              <span className="text-muted-foreground">
                                {formatWithCurrency(
                                  choice.amount ?? 0,
                                  storeData?.settings?.currency ?? "USD"
                                )}
                              </span>
                            </div>
                          </FormItem>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );

            case "Checkbox":
              return (
                <FormItem className="space-y-3">
                  <FormLabel>
                    {option.name}{" "}
                    {option.required && (
                      <span className="text-destructive">*</span>
                    )}
                  </FormLabel>
                  <div className="space-y-2">
                    {option.settings?.choices?.map((choice) => {
                      const answers = field.value || [];
                      const idx = answers.indexOf(choice.name);
                      const isChecked = idx !== -1;

                      const quantities = form.watch(quantitiesPath) || [];
                      const quantity = quantities[idx] ?? 1;

                      return (
                        <FormItem
                          key={choice.name}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2 py-2">
                            <FormControl>
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  const currentAnswers = field.value || [];
                                  const currentQuantities = getQuantities();
                                  const currentPrices = getPrices();

                                  if (checked) {
                                    // Add the choice
                                    field.onChange([
                                      ...currentAnswers,
                                      choice.name,
                                    ]);
                                    setQuantities([...currentQuantities, 1]);
                                    setPrices([
                                      ...currentPrices,
                                      choice.amount ?? 0,
                                    ]);
                                  } else {
                                    // Remove the choice
                                    const removeIdx = currentAnswers.indexOf(
                                      choice.name
                                    );
                                    if (removeIdx !== -1) {
                                      field.onChange(
                                        currentAnswers.filter(
                                          (v) => v !== choice.name
                                        )
                                      );
                                      setQuantities(
                                        currentQuantities.filter(
                                          (_, i) => i !== removeIdx
                                        )
                                      );
                                      setPrices(
                                        currentPrices.filter(
                                          (_, i) => i !== removeIdx
                                        )
                                      );
                                    }
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel>{choice.name}</FormLabel>
                          </div>
                          <div className="flex items-center space-x-4">
                            {option.settings?.enableQuantity && isChecked && (
                              <Select
                                value={quantity.toString()}
                                onValueChange={(val) => {
                                  const nextQuantities = [...getQuantities()];
                                  nextQuantities[idx] = Number(val);
                                  setQuantities(nextQuantities);
                                }}
                              >
                                <SelectTrigger
                                  size="sm"
                                  className="w-[60px] border-gray-300"
                                >
                                  <SelectValue placeholder="1" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[180px]">
                                  {Array.from({ length: 10 }, (_, i) => {
                                    const value = (i + 1).toString();
                                    return (
                                      <SelectItem key={value} value={value}>
                                        {value}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            )}
                            <span className="text-muted-foreground">
                              {formatWithCurrency(
                                choice.amount ?? 0,
                                storeData?.settings?.currency ?? "USD"
                              )}
                            </span>
                          </div>
                        </FormItem>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              );

            case "Number":
              return (
                <FormItem>
                  <FormLabel>{option.name}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value?.[0] ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? [] : [parseInt(val, 10)]);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );

            case "Text":
              return (
                <FormItem>
                  <FormLabel>{option.name}</FormLabel>
                  <FormControl>
                    <Textarea
                      value={field.value?.[0] ?? ""}
                      onChange={(e) => field.onChange([e.target.value])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );

            // handle other cases (Checkbox, Number, Text) similarly
            default:
              return <></>;
          }
        }}
      />
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-5 min-h-screen bg-white relative">
      <div className="w-full mx-auto p-4 lg:p-6 min-h-screen">
        <Button variant="ghost" asChild className="mb-6 hover:bg-gray-100">
          <Link href={`/${storeData?.slug}`}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          {(product?.imgUrls?.length ?? 0) > 0 && (
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-background to-secondary/30">
              <Image
                priority
                width={400}
                height={400}
                src={product?.imgUrls![0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {product?.imgUrls?.length === 0 && (
            <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center mb-3">
              <ShoppingCart className="h-20 w-20 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
          )}

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="mb-2">
                {product.categories!.length > 0 &&
                  product.categories!.map((category) => (
                    <span
                      key={category._id}
                      className="text-sm text-muted-foreground font-medium uppercase tracking-wider"
                    >
                      {category.name}
                    </span>
                  ))}
              </div>
              <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {product.description}
              </p>
            </div>

            {!!product.variants && product.variants.length > 0 && <Separator />}

            {/* Variants */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-serif font-semibold">
                        Variants
                      </h3>
                      {product.inventory!.quantity <= 5 && (
                        <Badge variant="secondary">
                          {product.inventory!.quantity} left
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-6">
                      {product.variants.length > 0 && (
                        <p className="text-sm font-medium">
                          Variants <span className="text-destructive">*</span>
                        </p>
                      )}
                      {product.variants.map((variant) =>
                        renderVariatnt(variant as Variant)
                      )}
                      {form.formState.errors.variantId && (
                        <p className="text-destructive text-sm italic">
                          {form.formState.errors.variantId.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {/* Options */}
                {product.options && product.options.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-serif font-semibold">
                      Options
                    </h3>
                    <div className="space-y-6">
                      {product.options?.map((option, index) =>
                        renderOption(option as Option, index)
                      )}
                    </div>
                  </div>
                )}

                {!!product.options && product.options.length > 0 && (
                  <Separator />
                )}

                {/* Quantity */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Quantity</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const current = form.watch("quantity") || 1;
                        form.setValue(
                          "quantity",
                          Math.max(1, Number(current) - 1)
                        );
                      }}
                      disabled={(form.watch("quantity") as number) <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-medium w-12 text-center">
                      {(form.watch("quantity") as number) || 1}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const current = form.watch("quantity") || 1;
                        form.setValue(
                          "quantity",
                          Math.max(1, Number(current) + 1)
                        );
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-6">
                  <Button
                    // onClick={handleAddToCart}
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    Add to Cart
                  </Button>
                  {/* <Button variant="outline" className="w-full" size="lg">
                Buy Now
              </Button> */}
                </div>
              </form>
            </Form>

            {/* Additional Info */}
            {/* <Card className="border-0 bg-secondary/30">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>✓ Free shipping on orders over $75</p>
                  <p>✓ 30-day return policy</p>
                  <p>✓ Sustainably sourced</p>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
      <DevTool control={form.control} />
    </div>
  );
};

export default ProductDetail;
// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Checkbox } from "@/components/ui/checkbox"
// import { ArrowLeft, Share, Minus, Plus, ShoppingCart, X } from "lucide-react"
// import { useRouter } from "next/navigation"

// interface ProductDetailPageProps {
//   params: { id: string }
//   isCartOpen?: boolean
//   setIsCartOpen?: (open: boolean) => void
// }

// interface CartItem {
//   id: string
//   name: string
//   size: string
//   quantity: number
//   price: number
//   addOns: string[]
// }

// export default function ProductDetailPage({ params, isCartOpen, setIsCartOpen }: ProductDetailPageProps) {
//   const router = useRouter()
//   const [selectedSize, setSelectedSize] = useState("S")
//   const [quantity, setQuantity] = useState(1)
//   const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
//   const [selectedNew, setSelectedNew] = useState<string[]>([])
//   const [selectedSideDishes, setSelectedSideDishes] = useState<string[]>([])
//   const [selectedHinYay, setSelectedHinYay] = useState<string[]>([])
//   const [selectedExtras, setSelectedExtras] = useState<string[]>([])
//   const [selectedSauces, setSelectedSauces] = useState<string[]>([])

//   const [localCartOpen, setLocalCartOpen] = useState(false)
//   const [cartItems, setCartItems] = useState<CartItem[]>([])

//   const cartOpen = isCartOpen ?? localCartOpen
//   const setCartOpen = setIsCartOpen ?? setLocalCartOpen

//   const product = {
//     id: 1,
//     name: "Monte",
//     sizes: [
//       { name: "S", price: 30.0, selected: true },
//       { name: "M", price: 50.0, stock: 6 },
//     ],
//     addOns: [
//       { name: "Spicy", price: 0 },
//       { name: "Fish", price: 10.0 },
//       { name: "Extra Vegetables", price: 5.0 },
//       { name: "Double Portion", price: 15.0 },
//       { name: "Less Oil", price: 0 },
//       { name: "Extra Crispy", price: 3.0 },
//     ],
//     newOptions: [
//       { name: "Egg", price: 10.0 },
//       { name: "Beef", price: 40.0 },
//       { name: "Chicken", price: 25.0 },
//       { name: "Pork", price: 30.0 },
//       { name: "Shrimp", price: 35.0 },
//       { name: "Tofu", price: 8.0 },
//     ],
//     sideDishes: [
//       { name: "Achin", price: 2.0 },
//       { name: "Akyaw", price: 40.0 },
//       { name: "Pickled Vegetables", price: 3.0 },
//       { name: "Fried Onions", price: 4.0 },
//       { name: "Cucumber Salad", price: 6.0 },
//       { name: "Bean Sprouts", price: 3.0 },
//       { name: "Fried Garlic", price: 2.0 },
//     ],
//     hinYay: [
//       { name: "Nga phal", price: 50.0 },
//       { name: "Apo", price: 30.0 },
//       { name: "Kyaw", price: 25.0 },
//       { name: "Thoke", price: 20.0 },
//       { name: "Ohn no", price: 35.0 },
//     ],
//     extras: [
//       { name: "Extra Rice", price: 5.0 },
//       { name: "Fried Rice", price: 12.0 },
//       { name: "Coconut Rice", price: 8.0 },
//       { name: "Brown Rice", price: 6.0 },
//     ],
//     sauces: [
//       { name: "Fish Sauce", price: 1.0 },
//       { name: "Chili Oil", price: 2.0 },
//       { name: "Tamarind Sauce", price: 3.0 },
//       { name: "Peanut Sauce", price: 4.0 },
//       { name: "Lime Juice", price: 1.0 },
//     ],
//   }

//   const calculateTotalPrice = () => {
//     const sizePrice = product.sizes.find((size) => size.name === selectedSize)?.price || 30.0

//     const addOnPrice = selectedAddOns.reduce((total, addon) => {
//       const item = product.addOns.find((item) => item.name === addon)
//       return total + (item?.price || 0)
//     }, 0)

//     const newPrice = selectedNew.reduce((total, item) => {
//       const newItem = product.newOptions.find((opt) => opt.name === item)
//       return total + (newItem?.price || 0)
//     }, 0)

//     const sideDishPrice = selectedSideDishes.reduce((total, dish) => {
//       const item = product.sideDishes.find((opt) => opt.name === dish)
//       return total + (item?.price || 0)
//     }, 0)

//     const hinYayPrice = selectedHinYay.reduce((total, item) => {
//       const hinYayItem = product.hinYay.find((opt) => opt.name === item)
//       return total + (hinYayItem?.price || 0)
//     }, 0)

//     const extrasPrice = selectedExtras.reduce((total, extra) => {
//       const item = product.extras.find((opt) => opt.name === extra)
//       return total + (item?.price || 0)
//     }, 0)

//     const saucesPrice = selectedSauces.reduce((total, sauce) => {
//       const item = product.sauces.find((opt) => opt.name === sauce)
//       return total + (item?.price || 0)
//     }, 0)

//     return (sizePrice + addOnPrice + newPrice + sideDishPrice + hinYayPrice + extrasPrice + saucesPrice) * quantity
//   }

//   const handleAddOnChange = (addon: string, checked: boolean) => {
//     if (checked) {
//       setSelectedAddOns([...selectedAddOns, addon])
//     } else {
//       setSelectedAddOns(selectedAddOns.filter((item) => item !== addon))
//     }
//   }

//   const handleNewChange = (item: string, checked: boolean) => {
//     if (checked) {
//       setSelectedNew([...selectedNew, item])
//     } else {
//       setSelectedNew(selectedNew.filter((newItem) => newItem !== item))
//     }
//   }

//   const handleSideDishChange = (dish: string, checked: boolean) => {
//     if (checked) {
//       setSelectedSideDishes([...selectedSideDishes, dish])
//     } else {
//       setSelectedSideDishes(selectedSideDishes.filter((item) => item !== dish))
//     }
//   }

//   const handleHinYayChange = (item: string, checked: boolean) => {
//     if (checked) {
//       setSelectedHinYay([...selectedHinYay, item])
//     } else {
//       setSelectedHinYay(selectedHinYay.filter((hinYayItem) => hinYayItem !== item))
//     }
//   }

//   const handleExtrasChange = (extra: string, checked: boolean) => {
//     if (checked) {
//       setSelectedExtras([...selectedExtras, extra])
//     } else {
//       setSelectedExtras(selectedExtras.filter((item) => item !== extra))
//     }
//   }

//   const handleSaucesChange = (sauce: string, checked: boolean) => {
//     if (checked) {
//       setSelectedSauces([...selectedSauces, sauce])
//     } else {
//       setSelectedSauces(selectedSauces.filter((item) => item !== sauce))
//     }
//   }

//   const handleAddToCart = () => {
//     const allSelectedOptions = [
//       ...selectedAddOns,
//       ...selectedNew,
//       ...selectedSideDishes,
//       ...selectedHinYay,
//       ...selectedExtras,
//       ...selectedSauces,
//     ]

//     const newItem: CartItem = {
//       id: Date.now().toString(),
//       name: product.name,
//       size: selectedSize,
//       quantity: quantity,
//       price: calculateTotalPrice(),
//       addOns: allSelectedOptions,
//     }

//     setCartItems([...cartItems, newItem])
//     setCartOpen(true)
//   }

//   const removeFromCart = (itemId: string) => {
//     setCartItems(cartItems.filter((item) => item.id !== itemId))
//   }

//   const getCartTotal = () => {
//     return cartItems.reduce((total, item) => total + item.price, 0)
//   }

//   const handleCartIconClick = () => {
//     console.log("[v0] Cart icon clicked, opening drawer")
//     setCartOpen(true)
//   }

//   return (
//     <div className="min-h-screen bg-white relative">
//       <div className="grid grid-cols-1 lg:grid-cols-5 min-h-screen">
//         {/* Left Side - Product Image */}
//         <div className="bg-gray-100 flex items-center justify-center p-4 lg:p-8 lg:col-span-2">
//           <div className="w-24 h-24 lg:w-32 lg:h-32 flex items-center justify-center">
//             <button onClick={handleCartIconClick}>
//               <ShoppingCart className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 hover:text-gray-600 cursor-pointer" />
//             </button>
//           </div>
//         </div>

//         {/* Right Side - Product Details */}
//         <div className="p-6 lg:p-8 flex flex-col lg:col-span-3">
//           <div className="flex items-center justify-between mb-8">
//             <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-gray-900">
//               <ArrowLeft className="w-5 h-5 mr-2" />
//               Back
//             </button>
//             <button onClick={handleCartIconClick} className="relative p-2 text-gray-600 hover:text-gray-900">
//               <ShoppingCart className="w-5 h-5" />
//               {cartItems.length > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                   {cartItems.length}
//                 </span>
//               )}
//             </button>
//           </div>

//           <div className="flex items-center justify-between mb-8">
//             <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
//             <button className="p-2 text-gray-600 hover:text-gray-900">
//               <Share className="w-5 h-5" />
//             </button>
//           </div>

//           <div className="mb-8">
//             <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="space-y-4">
//               {product.sizes.map((size) => (
//                 <div key={size.name} className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <RadioGroupItem value={size.name} id={size.name} className="w-5 h-5" />
//                     <label htmlFor={size.name} className="text-lg font-medium text-gray-900 cursor-pointer">
//                       {size.name}
//                     </label>
//                     {size.stock && (
//                       <span className="text-sm text-gray-500 uppercase tracking-wide">{size.stock} LEFT</span>
//                     )}
//                   </div>
//                   <span className="text-lg font-semibold text-gray-900">${size.price.toFixed(2)}</span>
//                 </div>
//               ))}
//             </RadioGroup>
//           </div>

//           <div className="mb-8">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Quantity</h3>
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                 className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
//               >
//                 <Minus className="w-4 h-4" />
//               </button>
//               <span className="text-lg font-medium w-8 text-center">{quantity}</span>
//               <button
//                 onClick={() => setQuantity(quantity + 1)}
//                 className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
//               >
//                 <Plus className="w-4 h-4" />
//               </button>
//             </div>
//           </div>

//           <div className="mb-8">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Add on <span className="text-red-500">*</span>
//             </h3>
//             <div className="space-y-3">
//               {product.addOns.map((addon) => (
//                 <div key={addon.name} className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <Checkbox
//                       id={`addon-${addon.name}`}
//                       checked={selectedAddOns.includes(addon.name)}
//                       onCheckedChange={(checked) => handleAddOnChange(addon.name, checked as boolean)}
//                     />
//                     <label htmlFor={`addon-${addon.name}`} className="text-gray-900 cursor-pointer">
//                       {addon.name}
//                     </label>
//                   </div>
//                   {addon.price > 0 && <span className="text-gray-900 font-medium">+ ${addon.price.toFixed(2)}</span>}
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="mb-8">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               New <span className="text-red-500">*</span>
//             </h3>
//             <div className="space-y-3">
//               {product.newOptions.map((item) => (
//                 <div key={item.name} className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <Checkbox
//                       id={`new-${item.name}`}
//                       checked={selectedNew.includes(item.name)}
//                       onCheckedChange={(checked) => handleNewChange(item.name, checked as boolean)}
//                     />
//                     <label htmlFor={`new-${item.name}`} className="text-gray-900 cursor-pointer">
//                       {item.name}
//                     </label>
//                   </div>
//                   <span className="text-gray-900 font-medium">+ ${item.price.toFixed(2)}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="mb-8">
//             <h3 className="text-lg font-semibold text-gray-900 mb-1">Side dishes</h3>
//             <p className="text-sm text-gray-500 mb-4">Optional</p>
//             <div className="space-y-3">
//               {product.sideDishes.map((dish) => (
//                 <div key={dish.name} className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <Checkbox
//                       id={`side-${dish.name}`}
//                       checked={selectedSideDishes.includes(dish.name)}
//                       onCheckedChange={(checked) => handleSideDishChange(dish.name, checked as boolean)}
//                     />
//                     <label htmlFor={`side-${dish.name}`} className="text-gray-900 cursor-pointer">
//                       {dish.name}
//                     </label>
//                   </div>
//                   <span className="text-gray-900 font-medium">+ ${dish.price.toFixed(2)}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="mb-8">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Hin yay <span className="text-red-500">*</span>
//             </h3>
//             <div className="space-y-3">
//               {product.hinYay.map((item) => (
//                 <div key={item.name} className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <Checkbox
//                       id={`hinyay-${item.name}`}
//                       checked={selectedHinYay.includes(item.name)}
//                       onCheckedChange={(checked) => handleHinYayChange(item.name, checked as boolean)}
//                     />
//                     <label htmlFor={`hinyay-${item.name}`} className="text-gray-900 cursor-pointer">
//                       {item.name}
//                     </label>
//                   </div>
//                   <span className="text-gray-900 font-medium">+ ${item.price.toFixed(2)}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="mb-8">
//             <h3 className="text-lg font-semibold text-gray-900 mb-1">Rice & Extras</h3>
//             <p className="text-sm text-gray-500 mb-4">Optional</p>
//             <div className="space-y-3">
//               {product.extras.map((extra) => (
//                 <div key={extra.name} className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <Checkbox
//                       id={`extra-${extra.name}`}
//                       checked={selectedExtras.includes(extra.name)}
//                       onCheckedChange={(checked) => handleExtrasChange(extra.name, checked as boolean)}
//                     />
//                     <label htmlFor={`extra-${extra.name}`} className="text-gray-900 cursor-pointer">
//                       {extra.name}
//                     </label>
//                   </div>
//                   <span className="text-gray-900 font-medium">+ ${extra.price.toFixed(2)}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="mb-8">
//             <h3 className="text-lg font-semibold text-gray-900 mb-1">Sauces & Condiments</h3>
//             <p className="text-sm text-gray-500 mb-4">Optional</p>
//             <div className="space-y-3">
//               {product.sauces.map((sauce) => (
//                 <div key={sauce.name} className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <Checkbox
//                       id={`sauce-${sauce.name}`}
//                       checked={selectedSauces.includes(sauce.name)}
//                       onCheckedChange={(checked) => handleSaucesChange(sauce.name, checked as boolean)}
//                     />
//                     <label htmlFor={`sauce-${sauce.name}`} className="text-gray-900 cursor-pointer">
//                       {sauce.name}
//                     </label>
//                   </div>
//                   <span className="text-gray-900 font-medium">+ ${sauce.price.toFixed(2)}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="mt-auto">
//             <Button
//               onClick={handleAddToCart}
//               className="w-full bg-black hover:bg-gray-800 text-white py-4 text-lg font-medium rounded-lg"
//             >
//               Add ${calculateTotalPrice().toFixed(2)}
//             </Button>
//           </div>

//           <div className="mt-8 pt-8 border-t border-gray-200 text-center space-y-4">
//             <div className="flex items-center justify-center text-gray-600">
//               <ShoppingCart className="w-4 h-4 mr-2" />
//               <span className="text-sm">Create your Take App</span>
//             </div>
//             <p className="text-xs text-gray-400">© 2025 Abc</p>
//           </div>
//         </div>
//       </div>

//       {cartOpen && (
//         <>
//           <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setCartOpen(false)} />
//           <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
//             <div className="flex flex-col h-full">
//               {/* Cart Header */}
//               <div className="flex items-center justify-between p-6 border-b border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-900">Your Cart</h2>
//                 <button onClick={() => setCartOpen(false)} className="p-2 text-gray-600 hover:text-gray-900">
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               {/* Cart Items */}
//               <div className="flex-1 overflow-y-auto p-6">
//                 {cartItems.length === 0 ? (
//                   <div className="text-center text-gray-500 mt-8">
//                     <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//                     <p>Your cart is empty</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {cartItems.map((item) => (
//                       <div key={item.id} className="bg-gray-50 rounded-lg p-4">
//                         <div className="flex items-start justify-between mb-2">
//                           <div>
//                             <h3 className="font-medium text-gray-900">{item.name}</h3>
//                             <p className="text-sm text-gray-600">Size: {item.size}</p>
//                             <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
//                           </div>
//                           <div className="text-right">
//                             <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
//                             <button
//                               onClick={() => removeFromCart(item.id)}
//                               className="text-red-500 text-sm hover:text-red-700"
//                             >
//                               Remove
//                             </button>
//                           </div>
//                         </div>
//                         {item.addOns.length > 0 && (
//                           <div className="mt-2">
//                             <p className="text-xs text-gray-500 mb-1">Add-ons:</p>
//                             <p className="text-xs text-gray-600">{item.addOns.join(", ")}</p>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Cart Footer */}
//               {cartItems.length > 0 && (
//                 <div className="border-t border-gray-200 p-6 space-y-4">
//                   <div className="flex items-center justify-between text-lg font-semibold">
//                     <span>Total:</span>
//                     <span>${getCartTotal().toFixed(2)}</span>
//                   </div>
//                   <div className="space-y-3">
//                     <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3">Checkout</Button>
//                     <Button variant="outline" className="w-full bg-transparent" onClick={() => setCartOpen(false)}>
//                       Continue Shopping
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }
