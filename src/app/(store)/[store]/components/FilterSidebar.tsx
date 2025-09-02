"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category } from "@/lib/api";

// const categories = [
//   { id: "burmese", name: "Burmese Food", count: 9 },
//   { id: "burger", name: "Burgers", count: 1 },
//   { id: "curry", name: "Curry", count: 7 },
// ];

export default function FilterSidebar({
  categories,
}: {
  categories: Category[];
}) {
  //   const [priceRange, setPriceRange] = useState([0, 100])
  //   const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  //   const [inStockOnly, setInStockOnly] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    }
  };

  //   const handleBrandChange = (brandId: string, checked: boolean) => {
  //     if (checked) {
  //       setSelectedBrands([...selectedBrands, brandId])
  //     } else {
  //       setSelectedBrands(selectedBrands.filter((id) => id !== brandId))
  //     }
  //   }

  return (
    <div className="space-y-6">
      {/* Price Range */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider value={priceRange} onValueChange={setPriceRange} max={100} step={1} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </CardContent>
      </Card> */}

      {/* Categories */}
      <Card className="max-h-[550px] overflow-auto">
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!!categories && categories.map((category) => (
            <div
              key={category._id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={category._id}
                  checked={selectedCategories.includes(category._id)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category._id, checked as boolean)
                  }
                />
                <Label htmlFor={category._id} className="text-sm font-normal">
                  {category.name}
                </Label>
              </div>
              <span className="text-xs text-muted-foreground">
                ({category.products.length})
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Brands */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-lg">Brands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={brand.id}
                  checked={selectedBrands.includes(brand.id)}
                  onCheckedChange={(checked) => handleBrandChange(brand.id, checked as boolean)}
                />
                <Label htmlFor={brand.id} className="text-sm font-normal">
                  {brand.name}
                </Label>
              </div>
              <span className="text-xs text-muted-foreground">({brand.count})</span>
            </div>
          ))}
        </CardContent>
      </Card> */}

      {/* Availability */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-lg">Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox id="in-stock" checked={inStockOnly} onCheckedChange={setInStockOnly} />
            <Label htmlFor="in-stock" className="text-sm font-normal">
              In stock only
            </Label>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
