export interface BranchStock {
  branchId: string;
  branchName: string;
  city: string;
  latitude: number;
  longitude: number;
  deliveryRadiusKm: number;
  inStock: boolean;
  stockQty: number;
  priceOverride?: number;
}

export const SUPERSTORE_COMPETITORS: string[] = [
  'Imtiaz Super Market',
  'Chase Up',
  'Naheed Supermarket',
  'Carrefour Pakistan',
  'Metro Cash & Carry',
  'Bin Hashim Supermarket'
];

export type ProductType = {
  id: string;
  sku: string;
  barcode?: string; // Product Barcode
  name: string;
  image: string;
  additionalImages?: string[];
  size?: string[]; // Pack weights e.g. ['500g', '1Kg']
  weight?: string;
  sellingPrice?: number; // Regular Selling Price (NO MRP)
  discountPrice?: number; // Optional Discount Price (if any)
  price: number; // Current active price
  mrp?: number;
  savings?: number;
  items_left: number; // Consolidated Stock Left
  items_sold?: number;
  category: string;
  subCategory: string;
  subSubCategory?: string;
  brand: string;
  storageType?: 'Freezed' | 'Chilled' | 'Ambient';
  shelfLife?: string;
  priceMatch?: boolean;
  priceMatchNote?: string;
  priceMatchCompetitors?: string[]; // Multiple competitor superstores
  labels?: string[]; // Custom labels/badges to display in product cart/card
  tags?: string[];
  rating?: number;
  reviews?: number;
  isFavourite?: boolean;
  description: string;
  specifications?: { key: string; value: string }[];
  branchStock: BranchStock[];
};

export const RAINBOW_SUPERSTORE_BRANCHES = [
  { id: 'b1', name: 'Branch 01 - Gulshan Superstore (Main Hub)', city: 'Karachi', latitude: 24.9207, longitude: 67.0935, deliveryRadiusKm: 10 },
  { id: 'b2', name: 'Branch 02 - Clifton Superstore (Ocean Mall)', city: 'Karachi', latitude: 24.8138, longitude: 67.0300, deliveryRadiusKm: 8 },
  { id: 'b3', name: 'Branch 03 - DHA Phase 6 Superstore', city: 'Karachi', latitude: 24.7865, longitude: 67.0684, deliveryRadiusKm: 7 },
  { id: 'b4', name: 'Branch 04 - North Nazimabad Superstore', city: 'Karachi', latitude: 24.9421, longitude: 67.0456, deliveryRadiusKm: 9 },
  { id: 'b5', name: 'Branch 05 - Bahria Town Superstore', city: 'Karachi', latitude: 24.9982, longitude: 67.3129, deliveryRadiusKm: 15 },
  { id: 'b6', name: 'Branch 06 - Tariq Road Superstore', city: 'Karachi', latitude: 24.8719, longitude: 67.0599, deliveryRadiusKm: 6 },
  { id: 'b7', name: 'Branch 07 - F.B Area Superstore', city: 'Karachi', latitude: 24.9351, longitude: 67.0722, deliveryRadiusKm: 7 },
  { id: 'b8', name: 'Branch 08 - Hyderi Superstore', city: 'Karachi', latitude: 24.9450, longitude: 67.0390, deliveryRadiusKm: 6 },
  { id: 'b9', name: 'Branch 09 - Malir Cantt Superstore', city: 'Karachi', latitude: 24.9189, longitude: 67.1950, deliveryRadiusKm: 12 },
  { id: 'b10', name: 'Branch 10 - PECHS Superstore', city: 'Karachi', latitude: 24.8620, longitude: 67.0650, deliveryRadiusKm: 6 }
];

export const ProductList: ProductType[] = [
  {
    id: 'PRD-RW-001',
    sku: 'RW-FRZ-SH01',
    name: 'Chicken Shashlik',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80'
    ],
    size: ['500g (6 Skewers)', '1000g (12 Skewers)'],
    weight: '500g',
    mrp: 930,
    price: 850,
    savings: 80,
    items_left: 486,
    items_sold: 340,
    category: 'Frozen Food',
    subCategory: 'Frozen Chicken',
    subSubCategory: 'Shashlik & Skewers',
    brand: 'Rainbow Frozen',
    storageType: 'Freezed',
    shelfLife: 'Life 10 days',
    priceMatch: true,
    priceMatchNote: 'Lower than Imtiaz',
    tags: ['Pre-Cut & Cleaned', 'Halal Certified'],
    rating: 4.8,
    reviews: 86,
    isFavourite: true,
    description: 'Quality product sourced carefully for Rainbow Cash & Carry customers. Hand-skewered tender chicken cubes marinated in authentic spices and garden-fresh bell peppers and onions.',
    specifications: [
      { key: 'Storage Condition', value: 'Keep frozen below -18°C' },
      { key: 'Shelf Life', value: '10 Days from delivery' },
      { key: 'Origin', value: 'Fresh Farm Broiler, Karachi' },
      { key: 'Halal Certified', value: 'Yes - 100% Halal Slaughter' },
      { key: 'Packaging', value: 'Vacuum Sealed Hygienic Tray' }
    ],
    branchStock: [
      { branchId: 'b1', branchName: 'Gulshan Superstore', city: 'Karachi', latitude: 24.9207, longitude: 67.0935, deliveryRadiusKm: 10, inStock: true, stockQty: 85 },
      { branchId: 'b2', branchName: 'Clifton Superstore', city: 'Karachi', latitude: 24.8138, longitude: 67.0300, deliveryRadiusKm: 8, inStock: true, stockQty: 64 },
      { branchId: 'b3', branchName: 'DHA Phase 6 Superstore', city: 'Karachi', latitude: 24.7865, longitude: 67.0684, deliveryRadiusKm: 7, inStock: true, stockQty: 48 },
      { branchId: 'b4', branchName: 'North Nazimabad Superstore', city: 'Karachi', latitude: 24.9421, longitude: 67.0456, deliveryRadiusKm: 9, inStock: true, stockQty: 52 },
      { branchId: 'b5', branchName: 'Bahria Town Superstore', city: 'Karachi', latitude: 24.9982, longitude: 67.3129, deliveryRadiusKm: 15, inStock: true, stockQty: 38 },
      { branchId: 'b6', branchName: 'Tariq Road Superstore', city: 'Karachi', latitude: 24.8719, longitude: 67.0599, deliveryRadiusKm: 6, inStock: true, stockQty: 45 },
      { branchId: 'b7', branchName: 'F.B Area Superstore', city: 'Karachi', latitude: 24.9351, longitude: 67.0722, deliveryRadiusKm: 7, inStock: true, stockQty: 40 },
      { branchId: 'b8', branchName: 'Hyderi Superstore', city: 'Karachi', latitude: 24.9450, longitude: 67.0390, deliveryRadiusKm: 6, inStock: true, stockQty: 36 },
      { branchId: 'b9', branchName: 'Malir Cantt Superstore', city: 'Karachi', latitude: 24.9189, longitude: 67.1950, deliveryRadiusKm: 12, inStock: true, stockQty: 42 },
      { branchId: 'b10', branchName: 'PECHS Superstore', city: 'Karachi', latitude: 24.8620, longitude: 67.0650, deliveryRadiusKm: 6, inStock: true, stockQty: 36 }
    ]
  },
  {
    id: 'PRD-RW-002',
    sku: 'RW-FRZ-WG02',
    name: 'Frozen Chicken Wings',
    image: 'https://images.unsplash.com/photo-1527477321055-43615b629c42?w=500&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1527477321055-43615b629c42?w=500&auto=format&fit=crop&q=80'
    ],
    size: ['1000g Pack'],
    weight: '1000g',
    mrp: 860,
    price: 780,
    savings: 80,
    items_left: 312,
    items_sold: 450,
    category: 'Frozen Food',
    subCategory: 'Frozen Chicken',
    subSubCategory: 'Chicken Wings & Drumsticks',
    brand: 'Rainbow Frozen',
    storageType: 'Freezed',
    shelfLife: 'Life 10 days',
    priceMatch: true,
    priceMatchNote: 'Lower than Imtiaz',
    tags: ['Pre-Cut & Cleaned', 'Local Farm'],
    rating: 4.7,
    reviews: 64,
    isFavourite: false,
    description: 'Cleaned, featherless, and flash-frozen prime grade chicken wings. Ideal for crispy deep frying, BBQ, or spicy hot wings preparation.',
    branchStock: [
      { branchId: 'b1', branchName: 'Gulshan Superstore', city: 'Karachi', latitude: 24.9207, longitude: 67.0935, deliveryRadiusKm: 10, inStock: true, stockQty: 50 },
      { branchId: 'b2', branchName: 'Clifton Superstore', city: 'Karachi', latitude: 24.8138, longitude: 67.0300, deliveryRadiusKm: 8, inStock: true, stockQty: 42 },
      { branchId: 'b3', branchName: 'DHA Phase 6 Superstore', city: 'Karachi', latitude: 24.7865, longitude: 67.0684, deliveryRadiusKm: 7, inStock: true, stockQty: 30 },
      { branchId: 'b4', branchName: 'North Nazimabad Superstore', city: 'Karachi', latitude: 24.9421, longitude: 67.0456, deliveryRadiusKm: 9, inStock: true, stockQty: 35 },
      { branchId: 'b5', branchName: 'Bahria Town Superstore', city: 'Karachi', latitude: 24.9982, longitude: 67.3129, deliveryRadiusKm: 15, inStock: false, stockQty: 0 },
      { branchId: 'b6', branchName: 'Tariq Road Superstore', city: 'Karachi', latitude: 24.8719, longitude: 67.0599, deliveryRadiusKm: 6, inStock: true, stockQty: 35 },
      { branchId: 'b7', branchName: 'F.B Area Superstore', city: 'Karachi', latitude: 24.9351, longitude: 67.0722, deliveryRadiusKm: 7, inStock: true, stockQty: 30 },
      { branchId: 'b8', branchName: 'Hyderi Superstore', city: 'Karachi', latitude: 24.9450, longitude: 67.0390, deliveryRadiusKm: 6, inStock: true, stockQty: 25 },
      { branchId: 'b9', branchName: 'Malir Cantt Superstore', city: 'Karachi', latitude: 24.9189, longitude: 67.1950, deliveryRadiusKm: 12, inStock: true, stockQty: 35 },
      { branchId: 'b10', branchName: 'PECHS Superstore', city: 'Karachi', latitude: 24.8620, longitude: 67.0650, deliveryRadiusKm: 6, inStock: true, stockQty: 30 }
    ]
  },
  {
    id: 'PRD-KN-003',
    sku: 'KN-NG-03',
    name: 'Crispy Chicken Nuggets',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80'
    ],
    size: ['500g', '1 Kg Economy Pack'],
    weight: '500g',
    mrp: 760,
    price: 690,
    savings: 70,
    items_left: 520,
    items_sold: 780,
    category: 'Frozen Food',
    subCategory: 'Frozen Chicken',
    subSubCategory: 'Nuggets & Tenders',
    brand: "K&N's",
    storageType: 'Freezed',
    shelfLife: 'Life 10 days',
    priceMatch: true,
    priceMatchNote: 'Lower than Imtiaz',
    tags: ['Halal Certified'],
    rating: 4.9,
    reviews: 142,
    isFavourite: true,
    description: "K&N's Crispy Chicken Nuggets made from 100% pure breast meat, lightly seasoned in golden breadcrumbs.",
    branchStock: [
      { branchId: 'b1', branchName: 'Gulshan Superstore', city: 'Karachi', latitude: 24.9207, longitude: 67.0935, deliveryRadiusKm: 10, inStock: true, stockQty: 70 },
      { branchId: 'b2', branchName: 'Clifton Superstore', city: 'Karachi', latitude: 24.8138, longitude: 67.0300, deliveryRadiusKm: 8, inStock: true, stockQty: 60 },
      { branchId: 'b3', branchName: 'DHA Phase 6 Superstore', city: 'Karachi', latitude: 24.7865, longitude: 67.0684, deliveryRadiusKm: 7, inStock: true, stockQty: 55 },
      { branchId: 'b4', branchName: 'North Nazimabad Superstore', city: 'Karachi', latitude: 24.9421, longitude: 67.0456, deliveryRadiusKm: 9, inStock: true, stockQty: 50 },
      { branchId: 'b5', branchName: 'Bahria Town Superstore', city: 'Karachi', latitude: 24.9982, longitude: 67.3129, deliveryRadiusKm: 15, inStock: true, stockQty: 45 },
      { branchId: 'b6', branchName: 'Tariq Road Superstore', city: 'Karachi', latitude: 24.8719, longitude: 67.0599, deliveryRadiusKm: 6, inStock: true, stockQty: 50 },
      { branchId: 'b7', branchName: 'F.B Area Superstore', city: 'Karachi', latitude: 24.9351, longitude: 67.0722, deliveryRadiusKm: 7, inStock: true, stockQty: 48 },
      { branchId: 'b8', branchName: 'Hyderi Superstore', city: 'Karachi', latitude: 24.9450, longitude: 67.0390, deliveryRadiusKm: 6, inStock: true, stockQty: 42 },
      { branchId: 'b9', branchName: 'Malir Cantt Superstore', city: 'Karachi', latitude: 24.9189, longitude: 67.1950, deliveryRadiusKm: 12, inStock: true, stockQty: 50 },
      { branchId: 'b10', branchName: 'PECHS Superstore', city: 'Karachi', latitude: 24.8620, longitude: 67.0650, deliveryRadiusKm: 6, inStock: true, stockQty: 50 }
    ]
  },
  {
    id: 'PRD-DW-004',
    sku: 'DW-PR-04',
    name: 'Aloo Paratha',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=80'
    ],
    size: ['Pack of 4', 'Pack of 8'],
    weight: '400g',
    mrp: 480,
    price: 420,
    savings: 60,
    items_left: 280,
    items_sold: 520,
    category: 'Frozen Food',
    subCategory: 'Paratha & Bread',
    subSubCategory: 'Aloo & Stuffed Parathas',
    brand: 'Dawn Foods',
    storageType: 'Freezed',
    shelfLife: 'Life 10 days',
    priceMatch: true,
    priceMatchNote: 'Lower than Imtiaz',
    tags: ['Local Farm'],
    rating: 4.6,
    reviews: 58,
    isFavourite: false,
    description: 'Golden, flaky multi-layered parathas generously stuffed with seasoned spicy potato filling. Ready in just 3 minutes on the tawa.',
    branchStock: [
      { branchId: 'b1', branchName: 'Gulshan Superstore', city: 'Karachi', latitude: 24.9207, longitude: 67.0935, deliveryRadiusKm: 10, inStock: true, stockQty: 40 },
      { branchId: 'b2', branchName: 'Clifton Superstore', city: 'Karachi', latitude: 24.8138, longitude: 67.0300, deliveryRadiusKm: 8, inStock: true, stockQty: 30 },
      { branchId: 'b3', branchName: 'DHA Phase 6 Superstore', city: 'Karachi', latitude: 24.7865, longitude: 67.0684, deliveryRadiusKm: 7, inStock: true, stockQty: 25 },
      { branchId: 'b4', branchName: 'North Nazimabad Superstore', city: 'Karachi', latitude: 24.9421, longitude: 67.0456, deliveryRadiusKm: 9, inStock: true, stockQty: 30 },
      { branchId: 'b5', branchName: 'Bahria Town Superstore', city: 'Karachi', latitude: 24.9982, longitude: 67.3129, deliveryRadiusKm: 15, inStock: true, stockQty: 25 },
      { branchId: 'b6', branchName: 'Tariq Road Superstore', city: 'Karachi', latitude: 24.8719, longitude: 67.0599, deliveryRadiusKm: 6, inStock: true, stockQty: 30 },
      { branchId: 'b7', branchName: 'F.B Area Superstore', city: 'Karachi', latitude: 24.9351, longitude: 67.0722, deliveryRadiusKm: 7, inStock: true, stockQty: 25 },
      { branchId: 'b8', branchName: 'Hyderi Superstore', city: 'Karachi', latitude: 24.9450, longitude: 67.0390, deliveryRadiusKm: 6, inStock: true, stockQty: 25 },
      { branchId: 'b9', branchName: 'Malir Cantt Superstore', city: 'Karachi', latitude: 24.9189, longitude: 67.1950, deliveryRadiusKm: 12, inStock: true, stockQty: 25 },
      { branchId: 'b10', branchName: 'PECHS Superstore', city: 'Karachi', latitude: 24.8620, longitude: 67.0650, deliveryRadiusKm: 6, inStock: true, stockQty: 25 }
    ]
  },
  {
    id: 'PRD-MN-005',
    sku: 'MN-CK-05',
    name: 'Chicken Chapli Kababs',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80'
    ],
    size: ['Pack of 6 (660g)'],
    weight: '660g',
    mrp: 850,
    price: 780,
    savings: 70,
    items_left: 360,
    items_sold: 410,
    category: 'Frozen Food',
    subCategory: 'Frozen Chicken',
    subSubCategory: 'Chapli & Seekh Kababs',
    brand: 'Menu Foods',
    storageType: 'Freezed',
    shelfLife: 'Life 10 days',
    priceMatch: true,
    priceMatchNote: 'Lower than Imtiaz',
    tags: ['Local Farm', 'Halal Certified'],
    rating: 4.8,
    reviews: 79,
    isFavourite: false,
    description: 'Peshawari style succulent minced chicken patties infused with crushed coriander, pomegranate seeds, and fresh green chilies.',
    branchStock: [
      { branchId: 'b1', branchName: 'Gulshan Superstore', city: 'Karachi', latitude: 24.9207, longitude: 67.0935, deliveryRadiusKm: 10, inStock: true, stockQty: 50 },
      { branchId: 'b2', branchName: 'Clifton Superstore', city: 'Karachi', latitude: 24.8138, longitude: 67.0300, deliveryRadiusKm: 8, inStock: true, stockQty: 40 },
      { branchId: 'b3', branchName: 'DHA Phase 6 Superstore', city: 'Karachi', latitude: 24.7865, longitude: 67.0684, deliveryRadiusKm: 7, inStock: true, stockQty: 35 },
      { branchId: 'b4', branchName: 'North Nazimabad Superstore', city: 'Karachi', latitude: 24.9421, longitude: 67.0456, deliveryRadiusKm: 9, inStock: true, stockQty: 40 },
      { branchId: 'b5', branchName: 'Bahria Town Superstore', city: 'Karachi', latitude: 24.9982, longitude: 67.3129, deliveryRadiusKm: 15, inStock: true, stockQty: 30 },
      { branchId: 'b6', branchName: 'Tariq Road Superstore', city: 'Karachi', latitude: 24.8719, longitude: 67.0599, deliveryRadiusKm: 6, inStock: true, stockQty: 35 },
      { branchId: 'b7', branchName: 'F.B Area Superstore', city: 'Karachi', latitude: 24.9351, longitude: 67.0722, deliveryRadiusKm: 7, inStock: true, stockQty: 35 },
      { branchId: 'b8', branchName: 'Hyderi Superstore', city: 'Karachi', latitude: 24.9450, longitude: 67.0390, deliveryRadiusKm: 6, inStock: true, stockQty: 30 },
      { branchId: 'b9', branchName: 'Malir Cantt Superstore', city: 'Karachi', latitude: 24.9189, longitude: 67.1950, deliveryRadiusKm: 12, inStock: true, stockQty: 35 },
      { branchId: 'b10', branchName: 'PECHS Superstore', city: 'Karachi', latitude: 24.8620, longitude: 67.0650, deliveryRadiusKm: 6, inStock: true, stockQty: 30 }
    ]
  },
  {
    id: 'PRD-RW-006',
    sku: 'RW-BC-06',
    name: 'Boneless Chicken Breast',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=80'
    ],
    size: ['1000g Pack'],
    weight: '1000g',
    mrp: 1080,
    price: 980,
    savings: 100,
    items_left: 420,
    items_sold: 630,
    category: 'Frozen Food',
    subCategory: 'Frozen Chicken',
    subSubCategory: 'Boneless Cuts & Fillets',
    brand: 'Rainbow Frozen',
    storageType: 'Freezed',
    shelfLife: 'Life 10 days',
    priceMatch: true,
    priceMatchNote: 'Lower than Imtiaz',
    tags: ['Pre-Cut & Cleaned', 'Halal Certified'],
    rating: 4.9,
    reviews: 110,
    isFavourite: true,
    description: '100% skinless, trimmed, and hygienically portioned fresh boneless chicken breast fillets. Sourced directly from bio-secure farms.',
    branchStock: [
      { branchId: 'b1', branchName: 'Gulshan Superstore', city: 'Karachi', latitude: 24.9207, longitude: 67.0935, deliveryRadiusKm: 10, inStock: true, stockQty: 60 },
      { branchId: 'b2', branchName: 'Clifton Superstore', city: 'Karachi', latitude: 24.8138, longitude: 67.0300, deliveryRadiusKm: 8, inStock: true, stockQty: 50 },
      { branchId: 'b3', branchName: 'DHA Phase 6 Superstore', city: 'Karachi', latitude: 24.7865, longitude: 67.0684, deliveryRadiusKm: 7, inStock: true, stockQty: 45 },
      { branchId: 'b4', branchName: 'North Nazimabad Superstore', city: 'Karachi', latitude: 24.9421, longitude: 67.0456, deliveryRadiusKm: 9, inStock: true, stockQty: 45 },
      { branchId: 'b5', branchName: 'Bahria Town Superstore', city: 'Karachi', latitude: 24.9982, longitude: 67.3129, deliveryRadiusKm: 15, inStock: true, stockQty: 35 },
      { branchId: 'b6', branchName: 'Tariq Road Superstore', city: 'Karachi', latitude: 24.8719, longitude: 67.0599, deliveryRadiusKm: 6, inStock: true, stockQty: 45 },
      { branchId: 'b7', branchName: 'F.B Area Superstore', city: 'Karachi', latitude: 24.9351, longitude: 67.0722, deliveryRadiusKm: 7, inStock: true, stockQty: 40 },
      { branchId: 'b8', branchName: 'Hyderi Superstore', city: 'Karachi', latitude: 24.9450, longitude: 67.0390, deliveryRadiusKm: 6, inStock: true, stockQty: 35 },
      { branchId: 'b9', branchName: 'Malir Cantt Superstore', city: 'Karachi', latitude: 24.9189, longitude: 67.1950, deliveryRadiusKm: 12, inStock: true, stockQty: 35 },
      { branchId: 'b10', branchName: 'PECHS Superstore', city: 'Karachi', latitude: 24.8620, longitude: 67.0650, deliveryRadiusKm: 6, inStock: true, stockQty: 30 }
    ]
  },
  {
    id: 'PRD-FF-007',
    sku: 'FF-PL-07',
    name: 'Fresh Spinach / Palak (Cleaned)',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=80',
    size: ['500g Bunch'],
    weight: '500g',
    mrp: 140,
    price: 120,
    savings: 20,
    items_left: 190,
    items_sold: 290,
    category: 'Fruits & Vegetables',
    subCategory: 'Fresh Vegetables',
    subSubCategory: 'Organic Cut Veggies',
    brand: 'Rainbow Fresh',
    storageType: 'Chilled',
    shelfLife: 'Life 3 days',
    priceMatch: true,
    priceMatchNote: 'Lower than Imtiaz',
    tags: ['Organic', 'Pre-Cut & Cleaned', 'Local Farm'],
    rating: 4.5,
    reviews: 42,
    isFavourite: false,
    description: 'Freshly harvested green spinach leaves, washed and root-trimmed for convenient daily cooking.',
    branchStock: [
      { branchId: 'b1', branchName: 'Gulshan Superstore', city: 'Karachi', latitude: 24.9207, longitude: 67.0935, deliveryRadiusKm: 10, inStock: true, stockQty: 30 },
      { branchId: 'b2', branchName: 'Clifton Superstore', city: 'Karachi', latitude: 24.8138, longitude: 67.0300, deliveryRadiusKm: 8, inStock: true, stockQty: 25 },
      { branchId: 'b3', branchName: 'DHA Phase 6 Superstore', city: 'Karachi', latitude: 24.7865, longitude: 67.0684, deliveryRadiusKm: 7, inStock: true, stockQty: 20 },
      { branchId: 'b4', branchName: 'North Nazimabad Superstore', city: 'Karachi', latitude: 24.9421, longitude: 67.0456, deliveryRadiusKm: 9, inStock: true, stockQty: 25 },
      { branchId: 'b5', branchName: 'Bahria Town Superstore', city: 'Karachi', latitude: 24.9982, longitude: 67.3129, deliveryRadiusKm: 15, inStock: true, stockQty: 15 },
      { branchId: 'b6', branchName: 'Tariq Road Superstore', city: 'Karachi', latitude: 24.8719, longitude: 67.0599, deliveryRadiusKm: 6, inStock: true, stockQty: 20 },
      { branchId: 'b7', branchName: 'F.B Area Superstore', city: 'Karachi', latitude: 24.9351, longitude: 67.0722, deliveryRadiusKm: 7, inStock: true, stockQty: 20 },
      { branchId: 'b8', branchName: 'Hyderi Superstore', city: 'Karachi', latitude: 24.9450, longitude: 67.0390, deliveryRadiusKm: 6, inStock: true, stockQty: 15 },
      { branchId: 'b9', branchName: 'Malir Cantt Superstore', city: 'Karachi', latitude: 24.9189, longitude: 67.1950, deliveryRadiusKm: 12, inStock: true, stockQty: 10 },
      { branchId: 'b10', branchName: 'PECHS Superstore', city: 'Karachi', latitude: 24.8620, longitude: 67.0650, deliveryRadiusKm: 6, inStock: true, stockQty: 10 }
    ]
  },
  {
    id: 'PRD-FF-008',
    sku: 'FF-GJ-08',
    name: 'Fresh Red Carrots / Gajar',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop&q=80',
    size: ['1000g'],
    weight: '1 Kg',
    mrp: 110,
    price: 90,
    savings: 20,
    items_left: 310,
    items_sold: 490,
    category: 'Fruits & Vegetables',
    subCategory: 'Fresh Vegetables',
    subSubCategory: 'Organic Cut Veggies',
    brand: 'Rainbow Fresh',
    storageType: 'Chilled',
    shelfLife: 'Life 7 days',
    priceMatch: true,
    priceMatchNote: 'Lower than Imtiaz',
    tags: ['Local Farm'],
    rating: 4.6,
    reviews: 35,
    isFavourite: false,
    description: 'Crisp, sweet, and crunchy fresh red carrots from interior Sindh farms. Ideal for fresh salads, juices, or traditional Gajar Halwa.',
    branchStock: [
      { branchId: 'b1', branchName: 'Gulshan Superstore', city: 'Karachi', latitude: 24.9207, longitude: 67.0935, deliveryRadiusKm: 10, inStock: true, stockQty: 45 },
      { branchId: 'b2', branchName: 'Clifton Superstore', city: 'Karachi', latitude: 24.8138, longitude: 67.0300, deliveryRadiusKm: 8, inStock: true, stockQty: 35 },
      { branchId: 'b3', branchName: 'DHA Phase 6 Superstore', city: 'Karachi', latitude: 24.7865, longitude: 67.0684, deliveryRadiusKm: 7, inStock: true, stockQty: 30 },
      { branchId: 'b4', branchName: 'North Nazimabad Superstore', city: 'Karachi', latitude: 24.9421, longitude: 67.0456, deliveryRadiusKm: 9, inStock: true, stockQty: 35 },
      { branchId: 'b5', branchName: 'Bahria Town Superstore', city: 'Karachi', latitude: 24.9982, longitude: 67.3129, deliveryRadiusKm: 15, inStock: true, stockQty: 30 },
      { branchId: 'b6', branchName: 'Tariq Road Superstore', city: 'Karachi', latitude: 24.8719, longitude: 67.0599, deliveryRadiusKm: 6, inStock: true, stockQty: 35 },
      { branchId: 'b7', branchName: 'F.B Area Superstore', city: 'Karachi', latitude: 24.9351, longitude: 67.0722, deliveryRadiusKm: 7, inStock: true, stockQty: 30 },
      { branchId: 'b8', branchName: 'Hyderi Superstore', city: 'Karachi', latitude: 24.9450, longitude: 67.0390, deliveryRadiusKm: 6, inStock: true, stockQty: 25 },
      { branchId: 'b9', branchName: 'Malir Cantt Superstore', city: 'Karachi', latitude: 24.9189, longitude: 67.1950, deliveryRadiusKm: 12, inStock: true, stockQty: 25 },
      { branchId: 'b10', branchName: 'PECHS Superstore', city: 'Karachi', latitude: 24.8620, longitude: 67.0650, deliveryRadiusKm: 6, inStock: true, stockQty: 20 }
    ]
  },
  {
    id: 'PRD-OL-009',
    sku: 'OL-MK-09',
    name: "Olper's Full Cream Milk 1L",
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80',
    size: ['1 Litre', '1.5 Litre Family Pack'],
    weight: '1 Litre',
    mrp: 330,
    price: 310,
    savings: 20,
    items_left: 640,
    items_sold: 1420,
    category: 'Dairy, Bread & Eggs',
    subCategory: 'Fresh Milk',
    brand: "Olper's (Engro)",
    storageType: 'Ambient',
    shelfLife: 'Life 90 days',
    priceMatch: true,
    priceMatchNote: 'Lower than Imtiaz',
    tags: ['Halal Certified'],
    rating: 4.9,
    reviews: 215,
    isFavourite: true,
    description: "Premium UHT full cream processed milk providing wholesome natural creaminess and daily essential calcium.",
    branchStock: [
      { branchId: 'b1', branchName: 'Gulshan Superstore', city: 'Karachi', latitude: 24.9207, longitude: 67.0935, deliveryRadiusKm: 10, inStock: true, stockQty: 120 },
      { branchId: 'b2', branchName: 'Clifton Superstore', city: 'Karachi', latitude: 24.8138, longitude: 67.0300, deliveryRadiusKm: 8, inStock: true, stockQty: 90 },
      { branchId: 'b3', branchName: 'DHA Phase 6 Superstore', city: 'Karachi', latitude: 24.7865, longitude: 67.0684, deliveryRadiusKm: 7, inStock: true, stockQty: 80 },
      { branchId: 'b4', branchName: 'North Nazimabad Superstore', city: 'Karachi', latitude: 24.9421, longitude: 67.0456, deliveryRadiusKm: 9, inStock: true, stockQty: 85 },
      { branchId: 'b5', branchName: 'Bahria Town Superstore', city: 'Karachi', latitude: 24.9982, longitude: 67.3129, deliveryRadiusKm: 15, inStock: true, stockQty: 60 },
      { branchId: 'b6', branchName: 'Tariq Road Superstore', city: 'Karachi', latitude: 24.8719, longitude: 67.0599, deliveryRadiusKm: 6, inStock: true, stockQty: 75 },
      { branchId: 'b7', branchName: 'F.B Area Superstore', city: 'Karachi', latitude: 24.9351, longitude: 67.0722, deliveryRadiusKm: 7, inStock: true, stockQty: 70 },
      { branchId: 'b8', branchName: 'Hyderi Superstore', city: 'Karachi', latitude: 24.9450, longitude: 67.0390, deliveryRadiusKm: 6, inStock: true, stockQty: 60 },
      { branchId: 'b9', branchName: 'Malir Cantt Superstore', city: 'Karachi', latitude: 24.9189, longitude: 67.1950, deliveryRadiusKm: 12, inStock: true, stockQty: 50 },
      { branchId: 'b10', branchName: 'PECHS Superstore', city: 'Karachi', latitude: 24.8620, longitude: 67.0650, deliveryRadiusKm: 6, inStock: true, stockQty: 50 }
    ]
  },
  {
    id: 'PRD-DL-010',
    sku: 'DL-OL-10',
    name: 'Dalda Cooking Oil 5L Tin',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80',
    size: ['5 Litre Tin'],
    weight: '5 Litres',
    mrp: 2800,
    price: 2650,
    savings: 150,
    items_left: 310,
    items_sold: 580,
    category: 'Oil & Ghee',
    subCategory: 'Cooking Oil',
    brand: 'Dalda Foods',
    storageType: 'Ambient',
    shelfLife: 'Life 365 days',
    priceMatch: true,
    priceMatchNote: 'Lower than Imtiaz',
    tags: ['Halal Certified'],
    rating: 4.8,
    reviews: 130,
    isFavourite: false,
    description: 'Enriched with Vitamin A and D with low cholesterol, Dalda Cooking Oil is Pakistan top-rated healthy kitchen choice.',
    branchStock: [
      { branchId: 'b1', branchName: 'Gulshan Superstore', city: 'Karachi', latitude: 24.9207, longitude: 67.0935, deliveryRadiusKm: 10, inStock: true, stockQty: 45 },
      { branchId: 'b2', branchName: 'Clifton Superstore', city: 'Karachi', latitude: 24.8138, longitude: 67.0300, deliveryRadiusKm: 8, inStock: true, stockQty: 35 },
      { branchId: 'b3', branchName: 'DHA Phase 6 Superstore', city: 'Karachi', latitude: 24.7865, longitude: 67.0684, deliveryRadiusKm: 7, inStock: true, stockQty: 30 },
      { branchId: 'b4', branchName: 'North Nazimabad Superstore', city: 'Karachi', latitude: 24.9421, longitude: 67.0456, deliveryRadiusKm: 9, inStock: true, stockQty: 35 },
      { branchId: 'b5', branchName: 'Bahria Town Superstore', city: 'Karachi', latitude: 24.9982, longitude: 67.3129, deliveryRadiusKm: 15, inStock: true, stockQty: 25 },
      { branchId: 'b6', branchName: 'Tariq Road Superstore', city: 'Karachi', latitude: 24.8719, longitude: 67.0599, deliveryRadiusKm: 6, inStock: true, stockQty: 30 },
      { branchId: 'b7', branchName: 'F.B Area Superstore', city: 'Karachi', latitude: 24.9351, longitude: 67.0722, deliveryRadiusKm: 7, inStock: true, stockQty: 30 },
      { branchId: 'b8', branchName: 'Hyderi Superstore', city: 'Karachi', latitude: 24.9450, longitude: 67.0390, deliveryRadiusKm: 6, inStock: true, stockQty: 25 },
      { branchId: 'b9', branchName: 'Malir Cantt Superstore', city: 'Karachi', latitude: 24.9189, longitude: 67.1950, deliveryRadiusKm: 12, inStock: true, stockQty: 25 },
      { branchId: 'b10', branchName: 'PECHS Superstore', city: 'Karachi', latitude: 24.8620, longitude: 67.0650, deliveryRadiusKm: 6, inStock: true, stockQty: 20 }
    ]
  },
  {
    id: 'PRD-TP-011',
    sku: 'TP-DN-11',
    name: 'Tapal Danedar Tea 900g Pouch',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80',
    size: ['900g Economy Pouch'],
    weight: '900g',
    mrp: 1550,
    price: 1450,
    savings: 100,
    items_left: 450,
    items_sold: 890,
    category: 'Tea & Coffee',
    subCategory: 'Black Tea',
    brand: 'Tapal Tea',
    storageType: 'Ambient',
    shelfLife: 'Life 365 days',
    priceMatch: true,
    priceMatchNote: 'Lower than Imtiaz',
    tags: ['Local Farm', 'Halal Certified'],
    rating: 4.9,
    reviews: 178,
    isFavourite: false,
    description: 'Renowned for its distinctive blend of high-grown Kenyan and Ceylon tea leaves, delivering an unmatched brisk aroma and robust golden color.',
    branchStock: [
      { branchId: 'b1', branchName: 'Gulshan Superstore', city: 'Karachi', latitude: 24.9207, longitude: 67.0935, deliveryRadiusKm: 10, inStock: true, stockQty: 60 },
      { branchId: 'b2', branchName: 'Clifton Superstore', city: 'Karachi', latitude: 24.8138, longitude: 67.0300, deliveryRadiusKm: 8, inStock: true, stockQty: 50 },
      { branchId: 'b3', branchName: 'DHA Phase 6 Superstore', city: 'Karachi', latitude: 24.7865, longitude: 67.0684, deliveryRadiusKm: 7, inStock: true, stockQty: 45 },
      { branchId: 'b4', branchName: 'North Nazimabad Superstore', city: 'Karachi', latitude: 24.9421, longitude: 67.0456, deliveryRadiusKm: 9, inStock: true, stockQty: 50 },
      { branchId: 'b5', branchName: 'Bahria Town Superstore', city: 'Karachi', latitude: 24.9982, longitude: 67.3129, deliveryRadiusKm: 15, inStock: true, stockQty: 40 },
      { branchId: 'b6', branchName: 'Tariq Road Superstore', city: 'Karachi', latitude: 24.8719, longitude: 67.0599, deliveryRadiusKm: 6, inStock: true, stockQty: 45 },
      { branchId: 'b7', branchName: 'F.B Area Superstore', city: 'Karachi', latitude: 24.9351, longitude: 67.0722, deliveryRadiusKm: 7, inStock: true, stockQty: 40 },
      { branchId: 'b8', branchName: 'Hyderi Superstore', city: 'Karachi', latitude: 24.9450, longitude: 67.0390, deliveryRadiusKm: 6, inStock: true, stockQty: 40 },
      { branchId: 'b9', branchName: 'Malir Cantt Superstore', city: 'Karachi', latitude: 24.9189, longitude: 67.1950, deliveryRadiusKm: 12, inStock: true, stockQty: 40 },
      { branchId: 'b10', branchName: 'PECHS Superstore', city: 'Karachi', latitude: 24.8620, longitude: 67.0650, deliveryRadiusKm: 6, inStock: true, stockQty: 35 }
    ]
  },
  {
    id: 'PRD-EG-012',
    sku: 'EG-CR-12',
    name: 'Farm Fresh White Eggs (Crate 30)',
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&auto=format&fit=crop&q=80',
    size: ['Crate of 30 Eggs'],
    weight: '30 pcs',
    mrp: 950,
    price: 890,
    savings: 60,
    items_left: 380,
    items_sold: 985,
    category: 'Dairy, Bread & Eggs',
    subCategory: 'Farm Fresh Eggs',
    brand: 'Rainbow Fresh',
    storageType: 'Chilled',
    shelfLife: 'Life 21 days',
    priceMatch: true,
    priceMatchNote: 'Lower than Imtiaz',
    tags: ['Local Farm'],
    rating: 4.8,
    reviews: 95,
    isFavourite: true,
    description: 'Freshly gathered, graded, and UV-sanitized farm fresh white eggs. Packed in protective cartons for safe transit.',
    branchStock: [
      { branchId: 'b1', branchName: 'Gulshan Superstore', city: 'Karachi', latitude: 24.9207, longitude: 67.0935, deliveryRadiusKm: 10, inStock: true, stockQty: 55 },
      { branchId: 'b2', branchName: 'Clifton Superstore', city: 'Karachi', latitude: 24.8138, longitude: 67.0300, deliveryRadiusKm: 8, inStock: true, stockQty: 45 },
      { branchId: 'b3', branchName: 'DHA Phase 6 Superstore', city: 'Karachi', latitude: 24.7865, longitude: 67.0684, deliveryRadiusKm: 7, inStock: true, stockQty: 40 },
      { branchId: 'b4', branchName: 'North Nazimabad Superstore', city: 'Karachi', latitude: 24.9421, longitude: 67.0456, deliveryRadiusKm: 9, inStock: true, stockQty: 45 },
      { branchId: 'b5', branchName: 'Bahria Town Superstore', city: 'Karachi', latitude: 24.9982, longitude: 67.3129, deliveryRadiusKm: 15, inStock: true, stockQty: 30 },
      { branchId: 'b6', branchName: 'Tariq Road Superstore', city: 'Karachi', latitude: 24.8719, longitude: 67.0599, deliveryRadiusKm: 6, inStock: true, stockQty: 40 },
      { branchId: 'b7', branchName: 'F.B Area Superstore', city: 'Karachi', latitude: 24.9351, longitude: 67.0722, deliveryRadiusKm: 7, inStock: true, stockQty: 35 },
      { branchId: 'b8', branchName: 'Hyderi Superstore', city: 'Karachi', latitude: 24.9450, longitude: 67.0390, deliveryRadiusKm: 6, inStock: true, stockQty: 35 },
      { branchId: 'b9', branchName: 'Malir Cantt Superstore', city: 'Karachi', latitude: 24.9189, longitude: 67.1950, deliveryRadiusKm: 12, inStock: true, stockQty: 30 },
      { branchId: 'b10', branchName: 'PECHS Superstore', city: 'Karachi', latitude: 24.8620, longitude: 67.0650, deliveryRadiusKm: 6, inStock: true, stockQty: 30 }
    ]
  }
];

// Ensure all products have modern fields populated
ProductList.forEach((p, idx) => {
  if (!p.barcode) {
    p.barcode = p.sku ? `8964000${(1000 + idx).toString()}` : `8964000${Date.now().toString().slice(-4)}`;
  }
  if (!p.sellingPrice) {
    p.sellingPrice = p.mrp || p.price;
  }
  if (p.price && p.mrp && p.price < p.mrp && !p.discountPrice) {
    p.discountPrice = p.price;
  }
  if (!p.labels || p.labels.length === 0) {
    p.labels = p.tags && p.tags.length > 0 ? [...p.tags] : ['100% Halal', 'Fresh Stock'];
  }
  if (!p.priceMatchCompetitors || p.priceMatchCompetitors.length === 0) {
    p.priceMatchCompetitors = idx % 2 === 0 ? ['Imtiaz Super Market', 'Chase Up'] : ['Imtiaz Super Market', 'Naheed Supermarket'];
  }
});

