'use client'
import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/app/(store)/[store]/providers/CartContext';
import { useCart } from '@/app/(store)/[store]/providers/CartContext';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { dispatch } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Quick add with default options
    const defaultOptions: Record<string, any> = {};
    product.options?.forEach(option => {
      if (option.type === 'variant' && option.required && option.options) {
        defaultOptions[option.id] = option.options[0];
      }
    });

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product,
        quantity: 1,
        selectedOptions: defaultOptions,
        totalPrice: product.price,
      },
    });

    dispatch({ type: 'OPEN_CART' });
  };

  return (
    <Link href={`/product/${product.id}`}>
      <Card 
        className="group cursor-pointer transition-all duration-300 hover:shadow-hover border-0 bg-card overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-background to-secondary/30">
          <Image
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Hover overlay */}
          <div className={`absolute inset-0 bg-primary/10 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
          
          {/* Quick add button */}
          <Button
            size="sm"
            className={`absolute bottom-4 right-4 transition-all duration-300 bg-primary hover:bg-primary/90 text-primary-foreground ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            onClick={handleQuickAdd}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <CardContent className="p-6">
          <div className="mb-2">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {product.category}
            </span>
          </div>
          
          <h3 className="font-serif text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-primary">
              ${product.price.toFixed(2)}
            </span>
            
            <span className="text-sm text-muted-foreground">
              View Details
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;