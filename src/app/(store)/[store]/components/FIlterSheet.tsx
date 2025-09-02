"use client";

import FilterSidebar from "@/app/(store)/[store]/components/FilterSidebar";
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
  console.log("pagination",pagination);
  
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
