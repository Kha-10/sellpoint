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
  FormDescription,
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
    quantities: opt.settings?.enableQuantity ? [1] : [],
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
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string[]>
  >({});

  const handleOptionChange = (
    optionId: string,
    value: string | number | boolean
  ) => {
    console.log("optionId", optionId, "value", value);

    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: value ? [optionId] : [],
    }));
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
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  };

  const renderOption = (option: Option, index: number) => {
    switch (option.type) {
      case "Selection":
        return (
          <div key={index} className="space-y-3">
            <Label className="text-sm font-medium">
              {option.name}{" "}
              {option.required && <span className="text-destructive">*</span>}
            </Label>
            <RadioGroup
              value={selectedOptions[option.name]?.[0] || ""}
              onValueChange={(value) => handleOptionChange(option.name, value)}
            >
              {option.settings?.choices?.map((optionValue) => (
                <div
                  key={optionValue.name}
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem
                    value={optionValue.name}
                    id={`${option.name}-${optionValue.name}`}
                    className="border-gray-300 "
                  />
                  <div className=" w-full text-sm flex items-center justify-between">
                    <p>{optionValue.name}</p>
                    <div className="flex items-center space-x-8">
                      <p className="text-muted-foreground">
                        {formatWithCurrency(
                          optionValue?.amount ?? 0,
                          storeData?.settings?.currency ?? "USD"
                        )}
                      </p>
                      {option.settings?.enableQuantity && (
                        <Select
                          value={selectedOptions[optionValue.name]?.[0] || ""}
                        >
                          <SelectTrigger className="w-[80px] border-gray-300">
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
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case "Checkbox":
        return (
          <div key={index} className="space-y-3">
            <Label className="text-sm font-medium">
              {option.name}{" "}
              {option.required && <span className="text-destructive">*</span>}
            </Label>
            <div className="flex items-center justify-between py-2">
              <div className="w-full space-y-4">
                {option.settings?.choices?.map((choice) => (
                  <div
                    key={choice.name}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        className="border-gray-300"
                        key={choice.name}
                        id={choice.name}
                        checked={
                          selectedOptions[choice.name]?.includes(choice.name) ||
                          false
                        }
                        onCheckedChange={(checked) =>
                          handleOptionChange(choice.name, checked as boolean)
                        }
                      />
                      <Label htmlFor={choice.name} className="text-sm">
                        {choice.name}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-8">
                      <p className="text-sm text-muted-foreground">
                        {formatWithCurrency(
                          choice?.amount ?? 0,
                          storeData?.settings?.currency ?? "USD"
                        )}
                      </p>
                      {option.settings?.enableQuantity && (
                        <Select value={selectedOptions[choice.name]?.[0] || ""}>
                          <SelectTrigger className="w-[80px] border-gray-300">
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "Number":
        return (
          <div key={index} className="space-y-2">
            <Label className="text-sm font-medium">
              {option.name}
              {option.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              type="number"
              className="bg-background w-full py-2 border border-gray-300 rounded-lg focus:ring-offset-0 focus:ring-0 focus:ring-emerald-700 focus:border-transparent"
              min="1"
              value={selectedOptions[option.name] || 1}
              onChange={(e) =>
                handleOptionChange(option.name, parseInt(e.target.value) || 1)
              }
            />
          </div>
        );

      case "Text":
        return (
          <div key={index} className="space-y-2">
            <Label className="text-sm font-medium">
              {option.name}
              {option.required && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              className="bg-background w-full py-2 border border-gray-300 rounded-lg focus:ring-0 focus:ring-offset-0 focus:ring-emerald-700 focus:border-transparent"
              placeholder={`Enter ${option.name.toLowerCase()}...`}
              value={selectedOptions[option.name] || ""}
              onChange={(e) => handleOptionChange(option.name, e.target.value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white px-5">
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
                priority={false}
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
                      {product.options.length > 0 &&
                        product.options.map((option) =>
                          renderOption(
                            option as Option,
                            product?.options?.indexOf(option) as number
                          )
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
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
            {/* Action Buttons */}
            <div className="space-y-3 pt-6">
              <Button
                // onClick={handleAddToCart}
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                Add to Cart
              </Button>
              {/* <Button variant="outline" className="w-full" size="lg">
                Buy Now
              </Button> */}
            </div>

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
