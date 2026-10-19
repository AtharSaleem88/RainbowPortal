import { RAINBOW_BRANCH_OPTIONS, BranchOption } from '../../promotions/data';

export interface CustomerCoupon {
  id: string;
  code: string; // e.g. 'RAINBOW10', 'WELCOME500', 'FREEDELIVERY'
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed_amount' | 'free_delivery';
  discountValue: number; // 10 for 10%, 500 for Rs. 500, or 0 for free delivery
  maxDiscountCap?: number; // e.g. 500
  minCartValue: number; // e.g. 2500
  customerSegment: 'All Customers' | 'New Customers (First Order)' | 'Repeat Customers (3+ Orders)';
  branchSelection: 'all' | 'specific';
  targetBranchIds: string[];
  targetBranchNames: string[];
  usageLimitTotal: number;
  usageCount: number;
  usageLimitPerCustomer: number;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Scheduled' | 'Expired' | 'Paused';
  totalSavingsAwarded: number;
  createdAt: string;
}

export const RAINBOW_COUPONS: CustomerCoupon[] = [
  {
    id: 'CPN-001',
    code: 'RAINBOW10',
    title: '10% Flat Discount on Supermarket Grocery',
    description: 'Get 10% off on all grocery orders above Rs. 2,500. Maximum discount capped at Rs. 500.',
    discountType: 'percentage',
    discountValue: 10,
    maxDiscountCap: 500,
    minCartValue: 2500,
    customerSegment: 'All Customers',
    branchSelection: 'all',
    targetBranchIds: RAINBOW_BRANCH_OPTIONS.map(b => b.id),
    targetBranchNames: ['All 10 Superstores'],
    usageLimitTotal: 2000,
    usageCount: 842,
    usageLimitPerCustomer: 2,
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    status: 'Active',
    totalSavingsAwarded: 294700,
    createdAt: '01/Oct/2026',
  },
  {
    id: 'CPN-002',
    code: 'WELCOME500',
    title: 'First Order Welcome Voucher &mdash; Rs. 500 OFF',
    description: 'Exclusive voucher for new app users on their first order above Rs. 3,000.',
    discountType: 'fixed_amount',
    discountValue: 500,
    minCartValue: 3000,
    customerSegment: 'New Customers (First Order)',
    branchSelection: 'all',
    targetBranchIds: RAINBOW_BRANCH_OPTIONS.map(b => b.id),
    targetBranchNames: ['All 10 Superstores'],
    usageLimitTotal: 1000,
    usageCount: 384,
    usageLimitPerCustomer: 1,
    startDate: '2026-10-01',
    endDate: '2026-11-15',
    status: 'Active',
    totalSavingsAwarded: 192000,
    createdAt: '01/Oct/2026',
  },
  {
    id: 'CPN-003',
    code: 'FREESHIP',
    title: 'Zero Delivery Fee Promo Code',
    description: 'Enjoy free doorstep delivery on orders above Rs. 2,000 across all Karachi branches.',
    discountType: 'free_delivery',
    discountValue: 250, // Standard delivery fee waived
    minCartValue: 2000,
    customerSegment: 'All Customers',
    branchSelection: 'all',
    targetBranchIds: RAINBOW_BRANCH_OPTIONS.map(b => b.id),
    targetBranchNames: ['All 10 Superstores'],
    usageLimitTotal: 5000,
    usageCount: 1420,
    usageLimitPerCustomer: 5,
    startDate: '2026-10-05',
    endDate: '2026-10-25',
    status: 'Active',
    totalSavingsAwarded: 355000,
    createdAt: '04/Oct/2026',
  },
  {
    id: 'CPN-004',
    code: 'CLIFTON20',
    title: 'Clifton & DHA Ocean Mall Privilege Coupon',
    description: 'Exclusive 20% discount on fresh produce and bakery for Clifton and DHA residents.',
    discountType: 'percentage',
    discountValue: 20,
    maxDiscountCap: 800,
    minCartValue: 3500,
    customerSegment: 'Repeat Customers (3+ Orders)',
    branchSelection: 'specific',
    targetBranchIds: ['b2', 'b3'],
    targetBranchNames: ['Clifton Superstore', 'DHA Phase 6 Superstore'],
    usageLimitTotal: 500,
    usageCount: 195,
    usageLimitPerCustomer: 2,
    startDate: '2026-10-10',
    endDate: '2026-10-24',
    status: 'Active',
    totalSavingsAwarded: 117000,
    createdAt: '09/Oct/2026',
  },
  {
    id: 'CPN-005',
    code: 'WEEKEND300',
    title: 'Weekend Super Shopper &mdash; Rs. 300 OFF',
    description: 'Friday to Sunday grocery restock coupon on cart values exceeding Rs. 4,000.',
    discountType: 'fixed_amount',
    discountValue: 300,
    minCartValue: 4000,
    customerSegment: 'All Customers',
    branchSelection: 'specific',
    targetBranchIds: ['b1', 'b4', 'b5', 'b7'],
    targetBranchNames: ['Gulshan Superstore', 'North Nazimabad Superstore', 'Bahria Town Superstore', 'F.B Area Superstore'],
    usageLimitTotal: 1500,
    usageCount: 0,
    usageLimitPerCustomer: 1,
    startDate: '2026-10-17',
    endDate: '2026-10-20',
    status: 'Scheduled',
    totalSavingsAwarded: 0,
    createdAt: '14/Oct/2026',
  },
  {
    id: 'CPN-006',
    code: 'SUPERSEPT',
    title: 'September End of Month Shopping Spree',
    description: 'Flat Rs. 400 voucher for high-value orders above Rs. 5,000.',
    discountType: 'fixed_amount',
    discountValue: 400,
    minCartValue: 5000,
    customerSegment: 'All Customers',
    branchSelection: 'all',
    targetBranchIds: RAINBOW_BRANCH_OPTIONS.map(b => b.id),
    targetBranchNames: ['All 10 Superstores'],
    usageLimitTotal: 800,
    usageCount: 800,
    usageLimitPerCustomer: 1,
    startDate: '2026-09-20',
    endDate: '2026-09-30',
    status: 'Expired',
    totalSavingsAwarded: 320000,
    createdAt: '18/Sep/2026',
  },
];
