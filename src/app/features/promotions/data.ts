export interface BranchOption {
  id: string;
  name: string;
  city: string;
}

export const RAINBOW_BRANCH_OPTIONS: BranchOption[] = [
  { id: 'b1', name: 'Branch 01 - Gulshan Superstore (Main Hub)', city: 'Karachi' },
  { id: 'b2', name: 'Branch 02 - Clifton Superstore (Ocean Mall)', city: 'Karachi' },
  { id: 'b3', name: 'Branch 03 - DHA Phase 6 Superstore', city: 'Karachi' },
  { id: 'b4', name: 'Branch 04 - North Nazimabad Superstore', city: 'Karachi' },
  { id: 'b5', name: 'Branch 05 - Bahria Town Superstore', city: 'Karachi' },
  { id: 'b6', name: 'Branch 06 - Tariq Road Superstore', city: 'Karachi' },
  { id: 'b7', name: 'Branch 07 - F.B Area Superstore', city: 'Karachi' },
  { id: 'b8', name: 'Branch 08 - Hyderi Superstore', city: 'Karachi' },
  { id: 'b9', name: 'Branch 09 - Malir Cantt Superstore', city: 'Karachi' },
  { id: 'b10', name: 'Branch 10 - PECHS Superstore', city: 'Karachi' },
];

export interface ProductPromotion {
  id: string; // e.g. 'PRM-2026-001'
  title: string;
  badgeText: string; // e.g. '15% OFF', 'WEEKEND SAVER', 'FLASH DEAL'
  scope: 'individual' | 'bulk'; // 'individual' product or 'bulk' category/brand

  // Individual product target
  productId?: string;
  productName?: string;
  productImage?: string;
  productSku?: string;
  originalPrice?: number;
  promoPrice?: number;

  // Bulk target
  bulkTargetType?: 'category' | 'subcategory' | 'subsubcategory' | 'brand';
  bulkTargetValue?: string; // e.g. 'Frozen Food' or 'Rainbow Frozen'
  estimatedItemsCount?: number;

  // Discount formula
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number; // e.g. 15 for 15% or 80 for Rs. 80

  // Branch applicability
  branchSelection: 'all' | 'specific';
  targetBranchIds: string[]; // e.g. ['b1', 'b2']
  targetBranchNames: string[]; // e.g. ['Gulshan Superstore', 'Clifton Superstore']

  // Schedule & Status
  startDate: string;
  endDate: string;
  status: 'Active' | 'Scheduled' | 'Expired' | 'Paused';

  // Stats
  ordersCount: number;
  totalSavingsGiven: number; // in PKR
  createdBy: string;
  createdAt: string;
}

export const RAINBOW_PROMOTIONS: ProductPromotion[] = [
  {
    id: 'PRM-2026-001',
    title: 'Weekend Chicken Shashlik Flash Deal',
    badgeText: 'SAVE RS. 120',
    scope: 'individual',
    productId: 'PRD-RW-001',
    productName: 'Chicken Shashlik (500g)',
    productImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=80',
    productSku: 'RW-FRZ-SH01',
    originalPrice: 930,
    promoPrice: 810,
    discountType: 'fixed_amount',
    discountValue: 120,
    branchSelection: 'specific',
    targetBranchIds: ['b1', 'b2', 'b3'],
    targetBranchNames: ['Gulshan Superstore', 'Clifton Superstore', 'DHA Phase 6 Superstore'],
    startDate: '2026-10-14',
    endDate: '2026-10-20',
    status: 'Active',
    ordersCount: 84,
    totalSavingsGiven: 10080,
    createdBy: 'Head of Merchandising',
    createdAt: '12/Oct/2026',
  },
  {
    id: 'PRM-2026-002',
    title: 'Frozen Food Category Mega Discount',
    badgeText: 'FLAT 15% OFF',
    scope: 'bulk',
    bulkTargetType: 'category',
    bulkTargetValue: 'Frozen Food',
    estimatedItemsCount: 18,
    discountType: 'percentage',
    discountValue: 15,
    branchSelection: 'all',
    targetBranchIds: RAINBOW_BRANCH_OPTIONS.map(b => b.id),
    targetBranchNames: ['All 10 Superstores'],
    startDate: '2026-10-10',
    endDate: '2026-10-25',
    status: 'Active',
    ordersCount: 312,
    totalSavingsGiven: 48900,
    createdBy: 'Commercial Team',
    createdAt: '09/Oct/2026',
  },
  {
    id: 'PRM-2026-003',
    title: 'Clifton & DHA Seafood Wings Special',
    badgeText: '10% OFF',
    scope: 'individual',
    productId: 'PRD-RW-002',
    productName: 'Frozen Chicken Wings (1000g)',
    productImage: 'https://images.unsplash.com/photo-1527477321055-43615b629c42?w=500&auto=format&fit=crop&q=80',
    productSku: 'RW-FRZ-WG02',
    originalPrice: 860,
    promoPrice: 774,
    discountType: 'percentage',
    discountValue: 10,
    branchSelection: 'specific',
    targetBranchIds: ['b2', 'b3'],
    targetBranchNames: ['Clifton Superstore', 'DHA Phase 6 Superstore'],
    startDate: '2026-10-12',
    endDate: '2026-10-19',
    status: 'Active',
    ordersCount: 46,
    totalSavingsGiven: 3956,
    createdBy: 'Branch Manager Clifton',
    createdAt: '11/Oct/2026',
  },
  {
    id: 'PRM-2026-004',
    title: 'Dairy & Chilled Essentials Bulk Savings',
    badgeText: 'WEEKLY SAVER',
    scope: 'bulk',
    bulkTargetType: 'category',
    bulkTargetValue: 'Dairy & Chilled',
    estimatedItemsCount: 42,
    discountType: 'percentage',
    discountValue: 12,
    branchSelection: 'specific',
    targetBranchIds: ['b1', 'b4', 'b5', 'b7'],
    targetBranchNames: ['Gulshan Superstore', 'North Nazimabad Superstore', 'Bahria Town Superstore', 'F.B Area Superstore'],
    startDate: '2026-10-15',
    endDate: '2026-10-30',
    status: 'Scheduled',
    ordersCount: 0,
    totalSavingsGiven: 0,
    createdBy: 'Catalog Ops',
    createdAt: '13/Oct/2026',
  },
  {
    id: 'PRM-2026-005',
    title: 'Rainbow Frozen In-House Brand Campaign',
    badgeText: 'RAINBOW BRAND 10% OFF',
    scope: 'bulk',
    bulkTargetType: 'brand',
    bulkTargetValue: 'Rainbow Frozen',
    estimatedItemsCount: 26,
    discountType: 'percentage',
    discountValue: 10,
    branchSelection: 'all',
    targetBranchIds: RAINBOW_BRANCH_OPTIONS.map(b => b.id),
    targetBranchNames: ['All 10 Superstores'],
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    status: 'Active',
    ordersCount: 520,
    totalSavingsGiven: 64200,
    createdBy: 'Super Admin',
    createdAt: '30/Sep/2026',
  },
  {
    id: 'PRM-2026-006',
    title: 'Bahria Town Exclusive Welcome Promo',
    badgeText: 'STORE SPECIAL RS. 150 OFF',
    scope: 'individual',
    productId: 'PRD-RW-001',
    productName: 'Chicken Shashlik (500g)',
    productImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=80',
    productSku: 'RW-FRZ-SH01',
    originalPrice: 930,
    promoPrice: 780,
    discountType: 'fixed_amount',
    discountValue: 150,
    branchSelection: 'specific',
    targetBranchIds: ['b5'],
    targetBranchNames: ['Bahria Town Superstore'],
    startDate: '2026-10-05',
    endDate: '2026-10-12',
    status: 'Expired',
    ordersCount: 110,
    totalSavingsGiven: 16500,
    createdBy: 'Bahria Branch Lead',
    createdAt: '03/Oct/2026',
  },
];
