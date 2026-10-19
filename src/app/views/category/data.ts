import { currency } from "@common/constants";

export interface MasterCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  icon: string;
  subCategoryCount: number;
  totalProducts: number;
  status: 'Active' | 'Inactive';
  createdBy: string;
  skuPrefix: string;
  description: string;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  parentCategoryId: string;
  parentCategoryName: string;
  image: string;
  icon: string;
  subSubCategoryCount: number;
  totalProducts: number;
  status: 'Active' | 'Inactive';
}

export interface SubSubCategory {
  id: string;
  name: string;
  slug: string;
  parentCategoryId: string;
  parentCategoryName: string;
  subCategoryId: string;
  subCategoryName: string;
  tags: string[];
  totalProducts: number;
  status: 'Active' | 'Inactive';
}

export interface BrandCategoryMapping {
  categoryId: string;
  categoryName: string;
  subCategoryIds: string[];
  subCategoryNames: string[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  origin: 'Local (Pakistan)' | 'Imported';
  isVerified: boolean;
  isInHouse: boolean;
  categoryMappings: BrandCategoryMapping[];
  categoryNames: string[];
  subCategoryNames: string[];
  totalProducts: number;
  rating: number;
  status: 'Active' | 'Inactive';
  description: string;
}

// 20 Official Rainbow Supermarket Master Categories
export const MASTER_CATEGORIES: MasterCategory[] = [
  {
    id: 'CAT-01',
    name: 'Paan Corner',
    slug: 'paan-corner',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=160&auto=format&fit=crop&q=80',
    icon: 'solar:leaf-bold-duotone',
    subCategoryCount: 3,
    totalProducts: 48,
    status: 'Active',
    createdBy: 'Admin',
    skuPrefix: 'PC',
    description: 'Fresh paan, supari, meetha paan condiments and accessories sourced daily.'
  },
  {
    id: 'CAT-02',
    name: 'Dairy, Bread & Eggs',
    slug: 'dairy-bread-eggs',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=160&auto=format&fit=crop&q=80',
    icon: 'solar:cup-bold-duotone',
    subCategoryCount: 5,
    totalProducts: 342,
    status: 'Active',
    createdBy: 'Admin',
    skuPrefix: 'DBE',
    description: 'Fresh milk, farm fresh eggs, artisan bread, butter, cheese and dairy essentials.'
  },
  {
    id: 'CAT-03',
    name: 'Fruits & Vegetables',
    slug: 'fruits-vegetables',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=160&auto=format&fit=crop&q=80',
    icon: 'solar:apple-bold-duotone',
    subCategoryCount: 6,
    totalProducts: 295,
    status: 'Active',
    createdBy: 'Moderator',
    skuPrefix: 'FNV',
    description: 'Farm fresh seasonal fruits, green leafy vegetables, pre-cut veggies and salad mixes.'
  },
  {
    id: 'CAT-04',
    name: 'Cold Drinks & Juices',
    slug: 'cold-drinks-juices',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=160&auto=format&fit=crop&q=80',
    icon: 'solar:bottle-bold-duotone',
    subCategoryCount: 4,
    totalProducts: 180,
    status: 'Active',
    createdBy: 'Admin',
    skuPrefix: 'CDJ',
    description: 'Carbonated beverages, natural fruit nectars, energy drinks, and bottled pure water.'
  },
  {
    id: 'CAT-05',
    name: 'Snacks & Munchies',
    slug: 'snacks-munchies',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=160&auto=format&fit=crop&q=80',
    icon: 'solar:box-minimalistic-bold-duotone',
    subCategoryCount: 5,
    totalProducts: 260,
    status: 'Active',
    createdBy: 'Admin',
    skuPrefix: 'SNM',
    description: 'Potato crisps, traditional nimko, savory crackers, pretzels, and roasted nuts.'
  },
  {
    id: 'CAT-06',
    name: 'Breakfast & Instant Food',
    slug: 'breakfast-instant-food',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=160&auto=format&fit=crop&q=80',
    icon: 'solar:clock-circle-bold-duotone',
    subCategoryCount: 4,
    totalProducts: 145,
    status: 'Active',
    createdBy: 'Moderator',
    skuPrefix: 'BIF',
    description: 'Cereals, oatmeal, instant noodles, pancake mixes, and breakfast spreads.'
  },
  {
    id: 'CAT-07',
    name: 'Sweet Tooth',
    slug: 'sweet-tooth',
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=160&auto=format&fit=crop&q=80',
    icon: 'solar:heart-bold-duotone',
    subCategoryCount: 4,
    totalProducts: 190,
    status: 'Active',
    createdBy: 'Admin',
    skuPrefix: 'SWT',
    description: 'Chocolates, traditional mithai, candies, gummies, and confectionery desserts.'
  },
  {
    id: 'CAT-08',
    name: 'Bakery & Biscuits',
    slug: 'bakery-biscuits',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=160&auto=format&fit=crop&q=80',
    icon: 'solar:chef-hat-bold-duotone',
    subCategoryCount: 5,
    totalProducts: 210,
    status: 'Active',
    createdBy: 'Admin',
    skuPrefix: 'BNB',
    description: 'Freshly baked rusks, cookies, tea biscuits, cupcakes, and bakery savory items.'
  },
  {
    id: 'CAT-09',
    name: 'Tea & Coffee',
    slug: 'tea-coffee',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=160&auto=format&fit=crop&q=80',
    icon: 'solar:cup-star-bold-duotone',
    subCategoryCount: 4,
    totalProducts: 125,
    status: 'Active',
    createdBy: 'Admin',
    skuPrefix: 'TNC',
    description: 'Premium Danedar black tea, green tea, instant and ground coffee blends.'
  },
  {
    id: 'CAT-10',
    name: 'Atta, Rice & Dal',
    slug: 'atta-rice-dal',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=160&auto=format&fit=crop&q=80',
    icon: 'solar:shop-bold-duotone',
    subCategoryCount: 4,
    totalProducts: 175,
    status: 'Active',
    createdBy: 'Admin',
    skuPrefix: 'ARD',
    description: 'Whole wheat chakki atta, premium basmati rice, lentils, pulses and staples.'
  },
  {
    id: 'CAT-11',
    name: 'Oil & Ghee',
    slug: 'oil-ghee',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=160&auto=format&fit=crop&q=80',
    icon: 'solar:waterdrops-bold-duotone',
    subCategoryCount: 4,
    totalProducts: 98,
    status: 'Active',
    createdBy: 'Admin',
    skuPrefix: 'ONG',
    description: 'Refined cooking oil, banaspati ghee, pure desi ghee and virgin olive oils.'
  },
  {
    id: 'CAT-12',
    name: 'Sauces & Spreads',
    slug: 'sauces-spreads',
    image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=160&auto=format&fit=crop&q=80',
    icon: 'solar:magic-stick-3-bold-duotone',
    subCategoryCount: 4,
    totalProducts: 115,
    status: 'Active',
    createdBy: 'Moderator',
    skuPrefix: 'SNS',
    description: 'Tomato ketchup, mayonnaises, spicy chili sauces, pasta sauces and fruit jams.'
  },
  {
    id: 'CAT-13',
    name: 'Chicken, Meat & Fish',
    slug: 'chicken-meat-fish',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=160&auto=format&fit=crop&q=80',
    icon: 'solar:bone-bold-duotone',
    subCategoryCount: 4,
    totalProducts: 130,
    status: 'Active',
    createdBy: 'Admin',
    skuPrefix: 'CMF',
    description: 'Fresh halal broiler & organic chicken, prime mutton, beef and Arabian sea fish.'
  },
  {
    id: 'CAT-14',
    name: 'Organic & Healthy Living',
    slug: 'organic-healthy-living',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=160&auto=format&fit=crop&q=80',
    icon: 'solar:shield-check-bold-duotone',
    subCategoryCount: 3,
    totalProducts: 85,
    status: 'Active',
    createdBy: 'Moderator',
    skuPrefix: 'OHL',
    description: 'Certified organic honey, gluten-free grains, cold-pressed oils, chia seeds.'
  },
  {
    id: 'CAT-15',
    name: 'Baby Care',
    slug: 'baby-care',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=160&auto=format&fit=crop&q=80',
    icon: 'solar:user-bold-duotone',
    subCategoryCount: 4,
    totalProducts: 160,
    status: 'Active',
    createdBy: 'Admin',
    skuPrefix: 'BC',
    description: 'Baby diapers, gentle wipes, baby milk formulas, baby shampoos and lotions.'
  },
  {
    id: 'CAT-16',
    name: 'Pharma & Wellness',
    slug: 'pharma-wellness',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=160&auto=format&fit=crop&q=80',
    icon: 'solar:health-bold-duotone',
    subCategoryCount: 4,
    totalProducts: 220,
    status: 'Active',
    createdBy: 'Admin',
    skuPrefix: 'PNW',
    description: 'OTC wellness products, pain relief, multivitamins, antiseptic first aid products.'
  },
  {
    id: 'CAT-17',
    name: 'Cleaning Essentials',
    slug: 'cleaning-essentials',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=160&auto=format&fit=crop&q=80',
    icon: 'solar:trash-bin-trash-bold-duotone',
    subCategoryCount: 4,
    totalProducts: 175,
    status: 'Active',
    createdBy: 'Admin',
    skuPrefix: 'CLE',
    description: 'Laundry detergents, liquid dishwash, floor cleaners, disinfectants and trash bags.'
  },
  {
    id: 'CAT-18',
    name: 'Home & Office',
    slug: 'home-office',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=160&auto=format&fit=crop&q=80',
    icon: 'solar:buildings-bold-duotone',
    subCategoryCount: 3,
    totalProducts: 90,
    status: 'Active',
    createdBy: 'Moderator',
    skuPrefix: 'HNO',
    description: 'Kitchenware, tissue rolls, storage containers, stationery and office essentials.'
  },
  {
    id: 'CAT-19',
    name: 'Personal Care',
    slug: 'personal-care',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=160&auto=format&fit=crop&q=80',
    icon: 'solar:smile-circle-bold-duotone',
    subCategoryCount: 5,
    totalProducts: 310,
    status: 'Active',
    createdBy: 'Admin',
    skuPrefix: 'PC',
    description: 'Shampoos, beauty soaps, oral dental care, skincare lotions and deodorants.'
  },
  {
    id: 'CAT-20',
    name: 'Frozen Food',
    slug: 'frozen-food',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=160&auto=format&fit=crop&q=80',
    icon: 'solar:snowflake-bold-duotone',
    subCategoryCount: 8,
    totalProducts: 185,
    status: 'Active',
    createdBy: 'Admin',
    skuPrefix: 'FRZ',
    description: 'Chicken nuggets, shashlik, chapli kababs, parathas, frozen veggies, and ice creams.'
  }
];

// Sub Categories (highlighting Frozen Food as showcased in Customer App Image 2 & others)
export const SUB_CATEGORIES: SubCategory[] = [
  // Under Frozen Food (Image 2)
  {
    id: 'SUB-FRZ-01',
    name: 'Frozen Chicken',
    slug: 'frozen-chicken',
    parentCategoryId: 'CAT-20',
    parentCategoryName: 'Frozen Food',
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=120&auto=format&fit=crop&q=80',
    icon: 'solar:bone-bold-duotone',
    subSubCategoryCount: 4,
    totalProducts: 42,
    status: 'Active'
  },
  {
    id: 'SUB-FRZ-02',
    name: 'Frozen Snacks',
    slug: 'frozen-snacks',
    parentCategoryId: 'CAT-20',
    parentCategoryName: 'Frozen Food',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=120&auto=format&fit=crop&q=80',
    icon: 'solar:box-minimalistic-bold-duotone',
    subSubCategoryCount: 3,
    totalProducts: 35,
    status: 'Active'
  },
  {
    id: 'SUB-FRZ-03',
    name: 'Paratha & Bread',
    slug: 'paratha-bread',
    parentCategoryId: 'CAT-20',
    parentCategoryName: 'Frozen Food',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=120&auto=format&fit=crop&q=80',
    icon: 'solar:chef-hat-bold-duotone',
    subSubCategoryCount: 3,
    totalProducts: 24,
    status: 'Active'
  },
  {
    id: 'SUB-FRZ-04',
    name: 'Frozen Veg',
    slug: 'frozen-veg',
    parentCategoryId: 'CAT-20',
    parentCategoryName: 'Frozen Food',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=120&auto=format&fit=crop&q=80',
    icon: 'solar:leaf-bold-duotone',
    subSubCategoryCount: 3,
    totalProducts: 20,
    status: 'Active'
  },
  {
    id: 'SUB-FRZ-05',
    name: 'Frozen Seafood',
    slug: 'frozen-seafood',
    parentCategoryId: 'CAT-20',
    parentCategoryName: 'Frozen Food',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=120&auto=format&fit=crop&q=80',
    icon: 'solar:waterdrops-bold-duotone',
    subSubCategoryCount: 2,
    totalProducts: 18,
    status: 'Active'
  },
  {
    id: 'SUB-FRZ-06',
    name: 'Samosas & Rolls',
    slug: 'samosas-rolls',
    parentCategoryId: 'CAT-20',
    parentCategoryName: 'Frozen Food',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=120&auto=format&fit=crop&q=80',
    icon: 'solar:bag-bold-duotone',
    subSubCategoryCount: 3,
    totalProducts: 26,
    status: 'Active'
  },
  {
    id: 'SUB-FRZ-07',
    name: 'Ice Cream & Desserts',
    slug: 'ice-cream-desserts',
    parentCategoryId: 'CAT-20',
    parentCategoryName: 'Frozen Food',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=120&auto=format&fit=crop&q=80',
    icon: 'solar:cup-star-bold-duotone',
    subSubCategoryCount: 3,
    totalProducts: 20,
    status: 'Active'
  },

  // Under Dairy, Bread & Eggs
  {
    id: 'SUB-DBE-01',
    name: 'Fresh Milk',
    slug: 'fresh-milk',
    parentCategoryId: 'CAT-02',
    parentCategoryName: 'Dairy, Bread & Eggs',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=120&auto=format&fit=crop&q=80',
    icon: 'solar:bottle-bold-duotone',
    subSubCategoryCount: 3,
    totalProducts: 65,
    status: 'Active'
  },
  {
    id: 'SUB-DBE-02',
    name: 'Farm Fresh Eggs',
    slug: 'farm-fresh-eggs',
    parentCategoryId: 'CAT-02',
    parentCategoryName: 'Dairy, Bread & Eggs',
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=120&auto=format&fit=crop&q=80',
    icon: 'solar:cup-bold-duotone',
    subSubCategoryCount: 2,
    totalProducts: 38,
    status: 'Active'
  },
  {
    id: 'SUB-DBE-03',
    name: 'Butter & Cheese',
    slug: 'butter-cheese',
    parentCategoryId: 'CAT-02',
    parentCategoryName: 'Dairy, Bread & Eggs',
    image: 'https://images.unsplash.com/photo-1589881133595-a3c085cb731d?w=120&auto=format&fit=crop&q=80',
    icon: 'solar:box-bold-duotone',
    subSubCategoryCount: 3,
    totalProducts: 54,
    status: 'Active'
  },

  // Under Fruits & Vegetables
  {
    id: 'SUB-FNV-01',
    name: 'Fresh Vegetables',
    slug: 'fresh-vegetables',
    parentCategoryId: 'CAT-03',
    parentCategoryName: 'Fruits & Vegetables',
    image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=120&auto=format&fit=crop&q=80',
    icon: 'solar:leaf-bold-duotone',
    subSubCategoryCount: 4,
    totalProducts: 110,
    status: 'Active'
  },
  {
    id: 'SUB-FNV-02',
    name: 'Fresh Fruits',
    slug: 'fresh-fruits',
    parentCategoryId: 'CAT-03',
    parentCategoryName: 'Fruits & Vegetables',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=120&auto=format&fit=crop&q=80',
    icon: 'solar:apple-bold-duotone',
    subSubCategoryCount: 4,
    totalProducts: 95,
    status: 'Active'
  },

  // Under Cold Drinks & Juices
  {
    id: 'SUB-CDJ-01',
    name: 'Carbonated Soft Drinks',
    slug: 'carbonated-drinks',
    parentCategoryId: 'CAT-04',
    parentCategoryName: 'Cold Drinks & Juices',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=120&auto=format&fit=crop&q=80',
    icon: 'solar:bottle-bold-duotone',
    subSubCategoryCount: 2,
    totalProducts: 72,
    status: 'Active'
  },
  {
    id: 'SUB-CDJ-02',
    name: 'Pure Juices & Nectars',
    slug: 'pure-juices',
    parentCategoryId: 'CAT-04',
    parentCategoryName: 'Cold Drinks & Juices',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=120&auto=format&fit=crop&q=80',
    icon: 'solar:cup-bold-duotone',
    subSubCategoryCount: 3,
    totalProducts: 58,
    status: 'Active'
  }
];

// Sub-Sub Categories & Tags (Image 2 pills: All, Organic, Imported, Local Farm, Pre-Cut & Cleaned)
export const SUB_SUB_CATEGORIES: SubSubCategory[] = [
  {
    id: 'SSC-01',
    name: 'Shashlik & Skewers',
    slug: 'shashlik-skewers',
    parentCategoryId: 'CAT-20',
    parentCategoryName: 'Frozen Food',
    subCategoryId: 'SUB-FRZ-01',
    subCategoryName: 'Frozen Chicken',
    tags: ['Pre-Cut & Cleaned', 'Halal Certified'],
    totalProducts: 8,
    status: 'Active'
  },
  {
    id: 'SSC-02',
    name: 'Chicken Wings & Drumsticks',
    slug: 'chicken-wings-drumsticks',
    parentCategoryId: 'CAT-20',
    parentCategoryName: 'Frozen Food',
    subCategoryId: 'SUB-FRZ-01',
    subCategoryName: 'Frozen Chicken',
    tags: ['Pre-Cut & Cleaned', 'Local Farm'],
    totalProducts: 14,
    status: 'Active'
  },
  {
    id: 'SSC-03',
    name: 'Nuggets & Tenders',
    slug: 'nuggets-tenders',
    parentCategoryId: 'CAT-20',
    parentCategoryName: 'Frozen Food',
    subCategoryId: 'SUB-FRZ-01',
    subCategoryName: 'Frozen Chicken',
    tags: ['Halal Certified'],
    totalProducts: 12,
    status: 'Active'
  },
  {
    id: 'SSC-04',
    name: 'Chapli & Seekh Kababs',
    slug: 'chapli-seekh-kababs',
    parentCategoryId: 'CAT-20',
    parentCategoryName: 'Frozen Food',
    subCategoryId: 'SUB-FRZ-01',
    subCategoryName: 'Frozen Chicken',
    tags: ['Local Farm', 'Halal Certified'],
    totalProducts: 10,
    status: 'Active'
  },
  {
    id: 'SSC-05',
    name: 'Aloo & Stuffed Parathas',
    slug: 'aloo-stuffed-parathas',
    parentCategoryId: 'CAT-20',
    parentCategoryName: 'Frozen Food',
    subCategoryId: 'SUB-FRZ-03',
    subCategoryName: 'Paratha & Bread',
    tags: ['Local Farm'],
    totalProducts: 9,
    status: 'Active'
  },
  {
    id: 'SSC-06',
    name: 'Plain & Puri Parathas',
    slug: 'plain-puri-parathas',
    parentCategoryId: 'CAT-20',
    parentCategoryName: 'Frozen Food',
    subCategoryId: 'SUB-FRZ-03',
    subCategoryName: 'Paratha & Bread',
    tags: ['Halal Certified'],
    totalProducts: 11,
    status: 'Active'
  },
  {
    id: 'SSC-07',
    name: 'Boneless Cuts & Fillets',
    slug: 'boneless-cuts-fillets',
    parentCategoryId: 'CAT-20',
    parentCategoryName: 'Frozen Food',
    subCategoryId: 'SUB-FRZ-01',
    subCategoryName: 'Frozen Chicken',
    tags: ['Pre-Cut & Cleaned', 'Halal Certified'],
    totalProducts: 9,
    status: 'Active'
  },
  {
    id: 'SSC-08',
    name: 'Organic Cut Veggies',
    slug: 'organic-cut-veggies',
    parentCategoryId: 'CAT-03',
    parentCategoryName: 'Fruits & Vegetables',
    subCategoryId: 'SUB-FNV-01',
    subCategoryName: 'Fresh Vegetables',
    tags: ['Organic', 'Pre-Cut & Cleaned', 'Local Farm'],
    totalProducts: 18,
    status: 'Active'
  },
  {
    id: 'SSC-09',
    name: 'Imported Gourmet Fries',
    slug: 'imported-gourmet-fries',
    parentCategoryId: 'CAT-20',
    parentCategoryName: 'Frozen Food',
    subCategoryId: 'SUB-FRZ-04',
    subCategoryName: 'Frozen Veg',
    tags: ['Imported'],
    totalProducts: 6,
    status: 'Active'
  }
];

// Brands (Rainbow In-House & Official Partner Brands) with Category & Sub-Category associations
export const BRANDS: Brand[] = [
  {
    id: 'BRD-01',
    name: 'Rainbow Frozen',
    slug: 'rainbow-frozen',
    logo: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=100&auto=format&fit=crop&q=80',
    origin: 'Local (Pakistan)',
    isVerified: true,
    isInHouse: true,
    categoryMappings: [
      {
        categoryId: 'CAT-20',
        categoryName: 'Frozen Food',
        subCategoryIds: ['SUB-FRZ-01', 'SUB-FRZ-02', 'SUB-FRZ-03', 'SUB-FRZ-04', 'SUB-FRZ-05', 'SUB-FRZ-06'],
        subCategoryNames: ['Frozen Chicken', 'Frozen Snacks', 'Paratha & Bread', 'Frozen Veg', 'Frozen Seafood', 'Samosas & Rolls']
      },
      {
        categoryId: 'CAT-13',
        categoryName: 'Chicken, Meat & Fish',
        subCategoryIds: ['SUB-CMF-01'],
        subCategoryNames: ['Fresh Chicken']
      }
    ],
    categoryNames: ['Frozen Food', 'Chicken, Meat & Fish'],
    subCategoryNames: ['Frozen Chicken', 'Frozen Snacks', 'Paratha & Bread', 'Frozen Veg', 'Frozen Seafood', 'Samosas & Rolls'],
    totalProducts: 48,
    rating: 4.8,
    status: 'Active',
    description: "Rainbow's exclusive premium frozen food division offering restaurant-grade shashlik, kababs, and poultry."
  },
  {
    id: 'BRD-02',
    name: "K&N's",
    slug: 'k-and-ns',
    logo: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=100&auto=format&fit=crop&q=80',
    origin: 'Local (Pakistan)',
    isVerified: true,
    isInHouse: false,
    categoryMappings: [
      {
        categoryId: 'CAT-20',
        categoryName: 'Frozen Food',
        subCategoryIds: ['SUB-FRZ-01', 'SUB-FRZ-02'],
        subCategoryNames: ['Frozen Chicken', 'Frozen Snacks']
      }
    ],
    categoryNames: ['Frozen Food'],
    subCategoryNames: ['Frozen Chicken', 'Frozen Snacks'],
    totalProducts: 64,
    rating: 4.7,
    status: 'Active',
    description: 'Pakistan premier poultry brand specializing in safe and healthy chicken nuggets, sausages, and quick meals.'
  },
  {
    id: 'BRD-03',
    name: 'Dawn Foods',
    slug: 'dawn-foods',
    logo: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=100&auto=format&fit=crop&q=80',
    origin: 'Local (Pakistan)',
    isVerified: true,
    isInHouse: false,
    categoryMappings: [
      {
        categoryId: 'CAT-20',
        categoryName: 'Frozen Food',
        subCategoryIds: ['SUB-FRZ-03', 'SUB-FRZ-02', 'SUB-FRZ-06'],
        subCategoryNames: ['Paratha & Bread', 'Frozen Snacks', 'Samosas & Rolls']
      },
      {
        categoryId: 'CAT-08',
        categoryName: 'Bakery & Biscuits',
        subCategoryIds: [],
        subCategoryNames: ['Fresh Bread & Rusks']
      }
    ],
    categoryNames: ['Frozen Food', 'Bakery & Biscuits'],
    subCategoryNames: ['Paratha & Bread', 'Frozen Snacks', 'Samosas & Rolls', 'Fresh Bread & Rusks'],
    totalProducts: 52,
    rating: 4.6,
    status: 'Active',
    description: 'Trusted market leader in frozen parathas, breads, snacks, samosas and dough items.'
  },
  {
    id: 'BRD-04',
    name: 'Menu Foods',
    slug: 'menu-foods',
    logo: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=100&auto=format&fit=crop&q=80',
    origin: 'Local (Pakistan)',
    isVerified: true,
    isInHouse: false,
    categoryMappings: [
      {
        categoryId: 'CAT-20',
        categoryName: 'Frozen Food',
        subCategoryIds: ['SUB-FRZ-01', 'SUB-FRZ-02'],
        subCategoryNames: ['Frozen Chicken', 'Frozen Snacks']
      }
    ],
    categoryNames: ['Frozen Food'],
    subCategoryNames: ['Frozen Chicken', 'Frozen Snacks'],
    totalProducts: 40,
    rating: 4.5,
    status: 'Active',
    description: 'Delicious ready-to-fry and ready-to-bake chicken burgers, chapli kababs, and fingers.'
  },
  {
    id: 'BRD-05',
    name: 'Mon Salwa',
    slug: 'mon-salwa',
    logo: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=100&auto=format&fit=crop&q=80',
    origin: 'Local (Pakistan)',
    isVerified: true,
    isInHouse: false,
    categoryMappings: [
      {
        categoryId: 'CAT-20',
        categoryName: 'Frozen Food',
        subCategoryIds: ['SUB-FRZ-06', 'SUB-FRZ-03', 'SUB-FRZ-01'],
        subCategoryNames: ['Samosas & Rolls', 'Paratha & Bread', 'Frozen Chicken']
      }
    ],
    categoryNames: ['Frozen Food'],
    subCategoryNames: ['Samosas & Rolls', 'Paratha & Bread', 'Frozen Chicken'],
    totalProducts: 36,
    rating: 4.5,
    status: 'Active',
    description: 'Authentic frozen Pakistani snacks, crispy samosas, spring rolls, and parathas.'
  },
  {
    id: 'BRD-06',
    name: 'Sufi Foods',
    slug: 'sufi-foods',
    logo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=80',
    origin: 'Local (Pakistan)',
    isVerified: true,
    isInHouse: false,
    categoryMappings: [
      {
        categoryId: 'CAT-20',
        categoryName: 'Frozen Food',
        subCategoryIds: ['SUB-FRZ-01'],
        subCategoryNames: ['Frozen Chicken']
      },
      {
        categoryId: 'CAT-11',
        categoryName: 'Oil & Ghee',
        subCategoryIds: [],
        subCategoryNames: ['Cooking Oil', 'Banaspati Ghee']
      }
    ],
    categoryNames: ['Frozen Food', 'Oil & Ghee'],
    subCategoryNames: ['Frozen Chicken', 'Cooking Oil', 'Banaspati Ghee'],
    totalProducts: 44,
    rating: 4.6,
    status: 'Active',
    description: 'Sufi Banaspati and premium chicken nuggets, crispy bites, and tender fillets.'
  },
  {
    id: 'BRD-07',
    name: "Olper's (Engro)",
    slug: 'olpers',
    logo: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&auto=format&fit=crop&q=80',
    origin: 'Local (Pakistan)',
    isVerified: true,
    isInHouse: false,
    categoryMappings: [
      {
        categoryId: 'CAT-02',
        categoryName: 'Dairy, Bread & Eggs',
        subCategoryIds: ['SUB-DBE-01', 'SUB-DBE-03'],
        subCategoryNames: ['Fresh Milk', 'Butter & Cheese']
      }
    ],
    categoryNames: ['Dairy, Bread & Eggs'],
    subCategoryNames: ['Fresh Milk', 'Butter & Cheese'],
    totalProducts: 28,
    rating: 4.9,
    status: 'Active',
    description: "Engro Foods' flagship full-cream milk, dairy cream, cheese slices, and dairy powders."
  },
  {
    id: 'BRD-08',
    name: 'National Foods',
    slug: 'national-foods',
    logo: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=100&auto=format&fit=crop&q=80',
    origin: 'Local (Pakistan)',
    isVerified: true,
    isInHouse: false,
    categoryMappings: [
      {
        categoryId: 'CAT-12',
        categoryName: 'Sauces & Spreads',
        subCategoryIds: [],
        subCategoryNames: ['Ketchup', 'Pickles & Chutneys']
      },
      {
        categoryId: 'CAT-06',
        categoryName: 'Breakfast & Instant Food',
        subCategoryIds: [],
        subCategoryNames: ['Desserts & Custards', 'Instant Noodles']
      }
    ],
    categoryNames: ['Sauces & Spreads', 'Breakfast & Instant Food'],
    subCategoryNames: ['Ketchup', 'Pickles & Chutneys', 'Desserts & Custards'],
    totalProducts: 88,
    rating: 4.8,
    status: 'Active',
    description: 'Iconic Pakistani recipe mixes, pickles, tomato ketchup, jams, and culinary essentials.'
  },
  {
    id: 'BRD-09',
    name: 'Shan Foods',
    slug: 'shan-foods',
    logo: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&auto=format&fit=crop&q=80',
    origin: 'Local (Pakistan)',
    isVerified: true,
    isInHouse: false,
    categoryMappings: [
      {
        categoryId: 'CAT-12',
        categoryName: 'Sauces & Spreads',
        subCategoryIds: [],
        subCategoryNames: ['Cooking Pastes', 'Sauces']
      },
      {
        categoryId: 'CAT-10',
        categoryName: 'Atta, Rice & Dal',
        subCategoryIds: [],
        subCategoryNames: ['Biryani Rice Mixes', 'Daal Special']
      }
    ],
    categoryNames: ['Sauces & Spreads', 'Atta, Rice & Dal'],
    subCategoryNames: ['Cooking Pastes', 'Sauces', 'Biryani Rice Mixes'],
    totalProducts: 76,
    rating: 4.9,
    status: 'Active',
    description: 'World-renowned Pakistani spice mixes, biryani spices, ginger garlic paste, and accompaniments.'
  },
  {
    id: 'BRD-10',
    name: 'Dalda Foods',
    slug: 'dalda-foods',
    logo: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100&auto=format&fit=crop&q=80',
    origin: 'Local (Pakistan)',
    isVerified: true,
    isInHouse: false,
    categoryMappings: [
      {
        categoryId: 'CAT-11',
        categoryName: 'Oil & Ghee',
        subCategoryIds: [],
        subCategoryNames: ['Cooking Oil', 'Banaspati Ghee', 'Olive Oil']
      }
    ],
    categoryNames: ['Oil & Ghee'],
    subCategoryNames: ['Cooking Oil', 'Banaspati Ghee', 'Olive Oil'],
    totalProducts: 32,
    rating: 4.8,
    status: 'Active',
    description: 'Gold standard cooking oils, pure banaspati ghee, and olive cooking variants.'
  },
  {
    id: 'BRD-11',
    name: 'Tapal Tea',
    slug: 'tapal-tea',
    logo: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=100&auto=format&fit=crop&q=80',
    origin: 'Local (Pakistan)',
    isVerified: true,
    isInHouse: false,
    categoryMappings: [
      {
        categoryId: 'CAT-09',
        categoryName: 'Tea & Coffee',
        subCategoryIds: [],
        subCategoryNames: ['Black Tea', 'Green Tea']
      }
    ],
    categoryNames: ['Tea & Coffee'],
    subCategoryNames: ['Black Tea', 'Green Tea'],
    totalProducts: 24,
    rating: 4.9,
    status: 'Active',
    description: 'The taste of Pakistan: Danedar, Mezban, Family Mixture, and fragrant Green Tea.'
  },
  {
    id: 'BRD-12',
    name: 'Nestle Pakistan',
    slug: 'nestle-pakistan',
    logo: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=100&auto=format&fit=crop&q=80',
    origin: 'Imported',
    isVerified: true,
    isInHouse: false,
    categoryMappings: [
      {
        categoryId: 'CAT-02',
        categoryName: 'Dairy, Bread & Eggs',
        subCategoryIds: ['SUB-DBE-01'],
        subCategoryNames: ['Fresh Milk']
      },
      {
        categoryId: 'CAT-15',
        categoryName: 'Baby Care',
        subCategoryIds: [],
        subCategoryNames: ['Baby Formula', 'Cereals']
      },
      {
        categoryId: 'CAT-04',
        categoryName: 'Cold Drinks & Juices',
        subCategoryIds: ['SUB-CDJ-02'],
        subCategoryNames: ['Pure Juices & Nectars', 'Bottled Mineral Water']
      }
    ],
    categoryNames: ['Dairy, Bread & Eggs', 'Baby Care', 'Cold Drinks & Juices'],
    subCategoryNames: ['Fresh Milk', 'Baby Formula', 'Bottled Mineral Water'],
    totalProducts: 92,
    rating: 4.7,
    status: 'Active',
    description: 'Global nutritional giant offering Cerelac, MilkPak, Pure Life water, and Nescafe.'
  }
];

export function getBrandsForCategoryAndSubCategory(categoryId?: string, subCategoryId?: string): Brand[] {
  return BRANDS.filter(brand => {
    if (!categoryId || categoryId === 'all') return true;
    const mapping = brand.categoryMappings?.find(m => m.categoryId === categoryId || m.categoryName === categoryId);
    if (!mapping) return false;
    if (!subCategoryId || subCategoryId === 'all') return true;
    return mapping.subCategoryIds?.includes(subCategoryId) || 
           mapping.subCategoryNames?.some(name => name.toLowerCase().includes(subCategoryId.toLowerCase())) ||
           mapping.subCategoryNames?.length === 0;
  });
}

// Backward-compatible categoryList exported for existing components
export type CategoryType = {
  image: string;
  description: string;
  price: string;
  role: string;
  sku: string;
  id: string;
};

export const categoryList: CategoryType[] = MASTER_CATEGORIES.map(cat => ({
  image: cat.image,
  description: cat.name,
  price: `${currency}90 to ${currency}3,500`,
  role: cat.createdBy,
  sku: `RW-${cat.skuPrefix}`,
  id: cat.id
}));
