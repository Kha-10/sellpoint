import { Product } from '@/app/(store)/[store]/providers/CartContext';
import defaultImage from '../../../../../public/file.svg';

export const products: Product[] = [
  {
    id: '1',
    name: 'Wildflower Honey',
    price: 24.99,
    image: defaultImage,
    description: 'Pure wildflower honey sourced from local beekeepers. Rich, floral notes with a smooth finish.',
    category: 'Pantry',
    options: [
      {
        type: 'variant',
        id: 'size',
        name: 'Size',
        required: true,
        options: ['Small (250g)', 'Medium (500g)', 'Large (1kg)'],
      },
      {
        type: 'addon',
        id: 'gift-wrap',
        name: 'Gift Wrap',
        price: 3.99,
      },
    ],
  },
  {
    id: '2',
    name: 'Earl Grey Supreme',
    price: 18.99,
    image: defaultImage,
    description: 'Premium Ceylon black tea blended with bergamot oil and cornflower petals.',
    category: 'Beverages',
    options: [
      {
        type: 'variant',
        id: 'size',
        name: 'Size',
        required: true,
        options: ['50g Tin', '100g Tin', '250g Bulk'],
      },
      {
        type: 'text',
        id: 'brewing-notes',
        name: 'Special Brewing Instructions',
      },
    ],
  },
  {
    id: '3',
    name: 'Single Origin Coffee',
    price: 32.99,
    image: defaultImage,
    description: 'Ethiopian single origin coffee with notes of chocolate and berries. Freshly roasted weekly.',
    category: 'Beverages',
    options: [
      {
        type: 'variant',
        id: 'grind',
        name: 'Grind',
        required: true,
        options: ['Whole Bean', 'Coarse', 'Medium', 'Fine', 'Extra Fine'],
      },
      {
        type: 'variant',
        id: 'size',
        name: 'Size',
        required: true,
        options: ['250g', '500g', '1kg'],
      },
    ],
  },
  {
    id: '4',
    name: 'Extra Virgin Olive Oil',
    price: 45.99,
    image: defaultImage,
    description: 'Cold-pressed extra virgin olive oil from ancient groves in Tuscany. Perfect for finishing dishes.',
    category: 'Pantry',
    options: [
      {
        type: 'variant',
        id: 'size',
        name: 'Size',
        required: true,
        options: ['250ml', '500ml', '750ml'],
      },
    ],
  },
  {
    id: '5',
    name: 'Aged Manchego Cheese',
    price: 38.99,
    image: defaultImage,
    description: 'Traditional Spanish sheep cheese aged 12 months. Complex nutty flavor with crystalline texture.',
    category: 'Dairy',
    options: [
      {
        type: 'variant',
        id: 'size',
        name: 'Size',
        required: true,
        options: ['200g Wedge', '400g Wedge', 'Whole Wheel (3kg)'],
      },
      {
        type: 'text',
        id: 'special-requests',
        name: 'Special Requests',
      },
    ],
  },
  {
    id: '6',
    name: 'Sourdough Artisan Bread',
    price: 12.99,
    image: defaultImage,
    description: 'Hand-crafted sourdough with 48-hour fermentation. Crispy crust and complex flavor.',
    category: 'Bakery',
    options: [
      {
        type: 'variant',
        id: 'type',
        name: 'Type',
        required: true,
        options: ['Classic White', 'Whole Wheat', 'Seeded', 'Rye'],
      },
      {
        type: 'addon',
        id: 'sliced',
        name: 'Pre-sliced',
        price: 1.50,
      },
    ],
  },
];