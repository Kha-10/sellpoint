"use client";

import React from "react";
import { useState } from "react";
import { useCart } from "@/app/(store)/[store]/providers/CartContext";
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
import { Option, Variant } from "@/app/(store)/[store]/providers/CartContext";
import { formatWithCurrency } from "@/helper/formatCurrency";
import { StoreData } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormSchema, FormValues } from "@/lib/validation";
import { DevTool } from "@hookform/devtools";

const defaultValuesFromProduct = (product: Product): FormValues => ({
  variantId: "",
  options: (product?.options?.map((opt) => ({
    name: opt.name,
    type: opt.type,
    required: opt.required,
    value: opt.value,
    settings: {
      min: opt.settings?.min,
      max: opt.settings?.max,
      inputType: opt.settings?.inputType,
      enableQuantity: opt.settings?.enableQuantity,
      choices: opt.settings?.choices?.map((choice) => ({
        name: choice.name || "",
        amount: choice.amount,
      })),
    },
    answers: [],
    prices: [],
    quantities: [],
  })) || []) as {
    name: string;
    type: "Checkbox" | "Selection" | "Number" | "Text";
    required?: boolean;
    value?: string;
    settings?: {
      min?: number;
      max?: number;
      inputType?: string;
      enableQuantity?: boolean;
      choices?: { name: string; amount?: number }[];
    };
    answers: (string | number)[];
    prices: number[];
    quantities: number[];
  }[],
});

const ProductDetail = ({
  storeData,
  product,
}: {
  storeData?: StoreData;
  product: Product;
}) => {
  //   const { dispatch } = useCart();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValuesFromProduct(product),
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log("✅ form submit", data);
  };

  const [quantity, setQuantity] = useState(1);

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
                      {variant.name}
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

  //   const renderOption = (option: Option) => {
  //     // switch (option.type) {
  //     //   case "Selection":
  //     //     return (
  //     //       <div key={index} className="space-y-3">
  //     //         <Label className="text-sm font-medium">
  //     //           {option.name}{" "}
  //     //           {option.required && <span className="text-destructive">*</span>}
  //     //         </Label>
  //     //         <RadioGroup
  //     //           value={selectedOptions[option.name]?.[0] || ""}
  //     //           onValueChange={(value) => handleOptionChange(option.name, value)}
  //     //         >
  //     //           {option.settings?.choices?.map((optionValue) => (
  //     //             <div
  //     //               key={optionValue.name}
  //     //               className="flex items-center space-x-2"
  //     //             >
  //     //               <RadioGroupItem
  //     //                 value={optionValue.name}
  //     //                 id={`${option.name}-${optionValue.name}`}
  //     //                 className="border-gray-300 "
  //     //               />
  //     //               <div className=" w-full text-sm flex items-center justify-between">
  //     //                 <p>{optionValue.name}</p>
  //     //                 <div className="flex items-center space-x-8">
  //     //                   <p className="text-muted-foreground">
  //     //                     {formatWithCurrency(
  //     //                       optionValue?.amount ?? 0,
  //     //                       storeData?.settings?.currency ?? "USD"
  //     //                     )}
  //     //                   </p>
  //     //                   {option.settings?.enableQuantity && (
  //     //                     <Select
  //     //                       value={selectedOptions[optionValue.name]?.[0] || ""}
  //     //                     >
  //     //                       <SelectTrigger className="w-[80px] border-gray-300">
  //     //                         <SelectValue placeholder="1" />
  //     //                       </SelectTrigger>
  //     //                       <SelectContent className="max-h-[180px]">
  //     //                         {Array.from({ length: 10 }, (_, i) => {
  //     //                           const value = (i + 1).toString();
  //     //                           return (
  //     //                             <SelectItem key={value} value={value}>
  //     //                               {value}
  //     //                             </SelectItem>
  //     //                           );
  //     //                         })}
  //     //                       </SelectContent>
  //     //                     </Select>
  //     //                   )}
  //     //                 </div>
  //     //               </div>
  //     //             </div>
  //     //           ))}
  //     //         </RadioGroup>
  //     //       </div>
  //     //     );

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
                      //   value={currentAnswer?.toString() || ""}
                      //   onValueChange={(val) => {
                      //     field.onChange([val]);
                      //     setQuantities([1]);
                      //   }}
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
    <div className="flex flex-col max-w-5xl mx-auto min-h-screen bg-white px-5">
      <div className="w-full mx-auto p-4 lg:p-6">
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
                    <h3 className="text-lg font-serif font-semibold">
                      Variants
                    </h3>
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
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-medium w-12 text-center">
                      {quantity}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
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
