"use client";

import FilterSidebar from "@/components/FilterSidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Category } from "@/lib/api";

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
}

export default function FilterSheet({
  open,
  onOpenChange,
  categories,
}: FilterSheetProps) {
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <FilterSidebar categories={categories}/>
        </div>
      </SheetContent>
    </Sheet>
  );
}
