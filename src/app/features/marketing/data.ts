import { RAINBOW_CUSTOMERS_LIST } from '../customer/customer-list/data';
import { RAINBOW_BRANCH_OPTIONS } from '../promotions/data';

export interface PushNotificationCampaign {
  id: string;
  title: string;
  message: string;
  imageUrl?: string;
  targetType: 'all' | 'branch' | 'segment' | 'individual';
  targetBranch?: string; // e.g. 'Rainbow Superstore - Clifton'
  targetSegment?: string; // e.g. 'VIP Customers', 'Repeat Buyers', 'Cart Abandoners'
  targetCustomerId?: string;
  targetCustomerName?: string;
  targetCustomerPhone?: string;
  actionType?: 'home' | 'category' | 'product' | 'promotion' | 'branch' | 'wallet' | 'custom_url';
  actionTarget?: string; // e.g. 'Fresh Fruits & Vegetables'
  scheduledAt?: string;
  sentAt?: string;
  status: 'Sent' | 'Scheduled' | 'Draft';
  recipientsCount: number;
  deliveredCount: number;
  openRate: number; // percentage
  clickRate: number; // percentage
  createdAt: string;
}

export interface MarketingBanner {
  id: string;
  title: string;
  imageUrl: string;
  placement: 'Home Carousel Slider' | 'Category Header' | 'Checkout Offer' | 'App Popup Banner';
  branch: string; // 'All Branches' or specific branch
  linkType: 'category' | 'promotion' | 'product' | 'url';
  linkTarget: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Paused' | 'Scheduled';
  impressions: number;
  clicks: number;
  ctr: number;
}

export interface FlashDeal {
  id: string;
  title: string;
  subtitle: string;
  badge: string; // '30% OFF', 'BUY 1 GET 1', 'WEEKEND RUSH'
  discountPercentage: number;
  branch: string; // 'All Branches' or specific
  startTime: string;
  endTime: string;
  productsCount: number;
  bannerImage: string;
  status: 'Live' | 'Upcoming' | 'Ended';
  ordersGenerated: number;
  revenueGenerated: number;
}

export interface SmsCampaign {
  id: string;
  title: string;
  masking: string; // 'RAINBOW'
  message: string;
  targetType: 'all' | 'branch' | 'segment' | 'individual';
  targetDetail: string;
  recipientsCount: number;
  sentAt: string;
  status: 'Delivered' | 'Queued' | 'Scheduled';
  deliveryRate: number;
}

export interface ReferralConfig {
  isEnabled: boolean;
  referrerRewardAmount: number; // PKR in Rainbow Wallet
  refereeDiscountAmount: number; // PKR discount voucher
  minOrderValue: number; // PKR
  validityDays: number;
  totalReferrals: number;
  successfulOrders: number;
  totalRewardsAwarded: number;
  topReferrers: { name: string; phone: string; referralsCount: number; earnings: number }[];
}

export const MOCK_PUSH_NOTIFICATIONS: PushNotificationCampaign[] = [
  {
    id: 'NOTIF-1001',
    title: '⚡ Weekend Fresh Produce Bash: Flat 20% Off!',
    message: 'Farm-fresh fruits & organic vegetables restocked at Rainbow Valencia. Order now before stock runs out!',
    imageUrl: 'assets/images/products/product-1(1).png',
    targetType: 'branch',
    targetBranch: 'Rainbow Cash & Carry - Valencia, Lahore',
    actionType: 'category',
    actionTarget: 'Fresh Produce & Fruits',
    sentAt: '2026-10-14 10:30 AM',
    status: 'Sent',
    recipientsCount: 4850,
    deliveredCount: 4792,
    openRate: 28.4,
    clickRate: 14.2,
    createdAt: '2026-10-14 10:00 AM',
  },
  {
    id: 'NOTIF-1002',
    title: 'Exclusive VIP Offer: Rs. 500 Added to Your Wallet!',
    message: 'Dear VIP shopper, we have credited Rs. 500 to your Rainbow Wallet for your next grocery order. Happy shopping!',
    imageUrl: 'assets/images/products/product-6.png',
    targetType: 'individual',
    targetCustomerId: 'CUST-1001',
    targetCustomerName: 'Jamal (J4A2M4A3L792)',
    targetCustomerPhone: '+923009496195',
    actionType: 'wallet',
    actionTarget: 'My Rainbow Wallet',
    sentAt: '2026-10-13 04:15 PM',
    status: 'Sent',
    recipientsCount: 1,
    deliveredCount: 1,
    openRate: 100.0,
    clickRate: 100.0,
    createdAt: '2026-10-13 04:00 PM',
  },
  {
    id: 'NOTIF-1003',
    title: '🛒 Did you forget something in your cart?',
    message: 'Your supermarket essentials are waiting for you! Complete your order within 2 hours and get Free Express Delivery.',
    imageUrl: '',
    targetType: 'segment',
    targetSegment: 'Cart Abandoners',
    actionType: 'home',
    actionTarget: 'View Cart & Checkout',
    sentAt: '2026-10-13 11:00 AM',
    status: 'Sent',
    recipientsCount: 349,
    deliveredCount: 341,
    openRate: 34.6,
    clickRate: 19.8,
    createdAt: '2026-10-13 10:45 AM',
  },
  {
    id: 'NOTIF-1004',
    title: '🎉 Mega Clifton Branch Opening Anniversary!',
    message: 'Celebrate 5 years of Rainbow Clifton with Buy 1 Get 1 on all dairy, bakery & beverages this Friday!',
    imageUrl: 'assets/images/products/product-3.png',
    targetType: 'branch',
    targetBranch: 'Rainbow Superstore - Clifton, Karachi',
    actionType: 'promotion',
    actionTarget: 'Clifton Anniversary Mega Deals',
    scheduledAt: '2026-10-16 09:00 AM',
    status: 'Scheduled',
    recipientsCount: 8250,
    deliveredCount: 0,
    openRate: 0,
    clickRate: 0,
    createdAt: '2026-10-15 11:30 AM',
  },
  {
    id: 'NOTIF-1005',
    title: '📢 Nationwide Supermarket Flash Hour (8 PM - 10 PM)',
    message: 'Extra 15% discount on cooking oils, rice & poultry across all Rainbow branches in Lahore, Karachi & Sheikhupura.',
    imageUrl: 'assets/images/products/product-2.png',
    targetType: 'all',
    targetBranch: 'All Branches',
    actionType: 'promotion',
    actionTarget: 'Night Grocery Rush',
    scheduledAt: '2026-10-17 07:30 PM',
    status: 'Scheduled',
    recipientsCount: 30278,
    deliveredCount: 0,
    openRate: 0,
    clickRate: 0,
    createdAt: '2026-10-15 01:00 PM',
  },
  {
    id: 'NOTIF-1006',
    title: 'Special Reminder: Your Order #32440315 is Out for Delivery',
    message: 'Rider Tariq is arriving in 15 minutes with your Rainbow order from Valencia Branch.',
    targetType: 'individual',
    targetCustomerId: 'CUST-1007',
    targetCustomerName: 'Arooj Hammad',
    targetCustomerPhone: '+923217271204',
    actionType: 'home',
    actionTarget: 'Order Tracking',
    sentAt: '2026-10-14 02:45 PM',
    status: 'Sent',
    recipientsCount: 1,
    deliveredCount: 1,
    openRate: 100.0,
    clickRate: 85.0,
    createdAt: '2026-10-14 02:40 PM',
  },
];

export const MOCK_MARKETING_BANNERS: MarketingBanner[] = [
  {
    id: 'BAN-01',
    title: 'Weekend Grocery Fest - 25% Off Fresh Meat & Veggies',
    imageUrl: 'assets/images/small/img-1.jpg',
    placement: 'Home Carousel Slider',
    branch: 'All Branches',
    linkType: 'category',
    linkTarget: 'Fresh Produce',
    startDate: '2026-10-10',
    endDate: '2026-10-25',
    status: 'Active',
    impressions: 48920,
    clicks: 6840,
    ctr: 13.98,
  },
  {
    id: 'BAN-02',
    title: 'Valencia Cash & Carry Exclusive: Free Delivery over Rs. 3,000',
    imageUrl: 'assets/images/small/img-2.jpg',
    placement: 'Category Header',
    branch: 'Rainbow Cash & Carry - Valencia, Lahore',
    linkType: 'promotion',
    linkTarget: 'Valencia Express Free Delivery',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    status: 'Active',
    impressions: 18230,
    clicks: 2950,
    ctr: 16.18,
  },
  {
    id: 'BAN-03',
    title: 'Clifton Superstore Midnight Savers Popup',
    imageUrl: 'assets/images/small/img-3.jpg',
    placement: 'App Popup Banner',
    branch: 'Rainbow Superstore - Clifton, Karachi',
    linkType: 'promotion',
    linkTarget: 'Clifton Midnight Flash Sale',
    startDate: '2026-10-12',
    endDate: '2026-10-20',
    status: 'Active',
    impressions: 12400,
    clicks: 3120,
    ctr: 25.16,
  },
  {
    id: 'BAN-04',
    title: 'Rainbow Wallet Cashback Alert: Top-up & Get 10% Extra',
    imageUrl: 'assets/images/small/img-4.jpg',
    placement: 'Checkout Offer',
    branch: 'All Branches',
    linkType: 'promotion',
    linkTarget: 'Wallet Top-up Promo',
    startDate: '2026-10-05',
    endDate: '2026-11-05',
    status: 'Active',
    impressions: 34100,
    clicks: 5200,
    ctr: 15.24,
  },
];

export const MOCK_FLASH_DEALS: FlashDeal[] = [
  {
    id: 'FD-101',
    title: 'Morning Fresh Produce Rush',
    subtitle: 'Seasonal fruits, fresh greens & poultry at wholesale prices',
    badge: '30% OFF',
    discountPercentage: 30,
    branch: 'All Branches',
    startTime: '2026-10-15 08:00 AM',
    endTime: '2026-10-15 12:00 PM',
    productsCount: 42,
    bannerImage: 'assets/images/products/product-1(1).png',
    status: 'Live',
    ordersGenerated: 342,
    revenueGenerated: 684200,
  },
  {
    id: 'FD-102',
    title: 'Valencia Weekend Meat Festival',
    subtitle: 'Prime mutton cuts, farm beef & organic chicken boneless',
    badge: 'BUY 1 GET 1 50% OFF',
    discountPercentage: 25,
    branch: 'Rainbow Cash & Carry - Valencia, Lahore',
    startTime: '2026-10-17 10:00 AM',
    endTime: '2026-10-18 10:00 PM',
    productsCount: 18,
    bannerImage: 'assets/images/products/product-2.png',
    status: 'Upcoming',
    ordersGenerated: 0,
    revenueGenerated: 0,
  },
  {
    id: 'FD-103',
    title: 'Clifton Midnight Grocery Flash',
    subtitle: 'Beverages, ice creams, snacks & quick pantry reloads',
    badge: 'FLAT 20% OFF',
    discountPercentage: 20,
    branch: 'Rainbow Superstore - Clifton, Karachi',
    startTime: '2026-10-16 10:00 PM',
    endTime: '2026-10-17 02:00 AM',
    productsCount: 56,
    bannerImage: 'assets/images/products/product-3.png',
    status: 'Upcoming',
    ordersGenerated: 0,
    revenueGenerated: 0,
  },
];

export const MOCK_SMS_CAMPAIGNS: SmsCampaign[] = [
  {
    id: 'SMS-801',
    title: 'Valencia Weekend Flash Promo',
    masking: 'RAINBOW',
    message: 'RAINBOW: Flat 20% off on fresh chicken & fruits this weekend at Valencia Branch! Visit or order online at rainbow.pk. Helpline: 042-111-724-626',
    targetType: 'branch',
    targetDetail: 'Rainbow Cash & Carry - Valencia, Lahore',
    recipientsCount: 4850,
    sentAt: '2026-10-14 11:15 AM',
    status: 'Delivered',
    deliveryRate: 98.9,
  },
  {
    id: 'SMS-802',
    title: 'VIP Reward Credited SMS',
    masking: 'RAINBOW',
    message: 'Dear Jamal, Rs. 500 bonus has been credited to your Rainbow Wallet! Use it on your next grocery order. Code: VIPOCT. Rainbow Superstore',
    targetType: 'individual',
    targetDetail: 'Jamal (+923009496195)',
    recipientsCount: 1,
    sentAt: '2026-10-13 04:20 PM',
    status: 'Delivered',
    deliveryRate: 100.0,
  },
  {
    id: 'SMS-803',
    title: 'Nationwide Ramadan / Fest Pre-Booking',
    masking: 'RAINBOW',
    message: 'RAINBOW SUPERSTORE: Book your monthly grocery package today & get FREE delivery + Rs 300 Rainbow Wallet cashback across all branches! rainbow.pk',
    targetType: 'all',
    targetDetail: 'All Registered Customers (30,278)',
    recipientsCount: 30278,
    sentAt: '2026-10-10 10:00 AM',
    status: 'Delivered',
    deliveryRate: 97.4,
  },
];

export const MOCK_REFERRAL_CONFIG: ReferralConfig = {
  isEnabled: true,
  referrerRewardAmount: 200, // PKR added to Rainbow Wallet
  refereeDiscountAmount: 200, // PKR discount voucher
  minOrderValue: 2500, // PKR minimum spend on first order
  validityDays: 30,
  totalReferrals: 4280,
  successfulOrders: 3150,
  totalRewardsAwarded: 630000,
  topReferrers: [
    { name: 'Jamal', phone: '+923009496195', referralsCount: 48, earnings: 9600 },
    { name: 'Dr. Maria Asif', phone: '+923019876543', referralsCount: 31, earnings: 6200 },
    { name: 'Zubair Ahmed', phone: '+923004567890', referralsCount: 22, earnings: 4400 },
    { name: 'Arooj Hammad', phone: '+923217271204', referralsCount: 19, earnings: 3800 },
    { name: 'Sadaf Naeem', phone: '+923126789012', referralsCount: 14, earnings: 2800 },
  ],
};

export interface LoyaltyTier {
  id: string;
  name: string; // 'Bronze Member', 'Silver Preferred', 'Gold VIP Member'
  color: string;
  icon: string;
  minPoints: number;
  pointsMultiplier: number; // e.g. 1.0, 1.25, 1.5
  perks: string[];
  membersCount: number;
}

export interface BranchBonusMultiplier {
  id: string;
  branchName: string;
  multiplier: number; // e.g. 2.0x
  dayOfWeek: string;
  category: string;
  isActive: boolean;
}

export interface LoyaltyProgramConfig {
  isEnabled: boolean;
  earnPointsPerSpend: number; // Spend Rs. 100 to get X points (e.g. 1 point)
  redeemValueInPkr: number; // 1 point = Rs. 1.00 PKR discount or wallet credit
  minPointsToRedeem: number; // e.g. 100 points
  maxOrderRedemptionPercentage: number; // e.g. 50%
  pointsValidityMonths: number; // e.g. 12 months
  allowWalletConversion: boolean; // convert points to Rainbow Wallet balance
  tiers: LoyaltyTier[];
  branchMultipliers: BranchBonusMultiplier[];
}

export interface CustomerLoyaltyRecord {
  customerId: string;
  customerName: string;
  customerCode?: string;
  phone: string;
  email: string;
  preferredBranch: string;
  tier: 'Bronze Member' | 'Silver Preferred' | 'Gold VIP Member';
  currentPoints: number;
  pointsValueInPkr: number;
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  lastActivityDate: string;
  history: {
    id: string;
    date: string;
    type: 'Earned' | 'Redeemed' | 'Converted to Wallet' | 'Admin Bonus';
    points: number;
    amountPkr: number;
    description: string;
    branch: string;
  }[];
}

export const MOCK_LOYALTY_CONFIG: LoyaltyProgramConfig = {
  isEnabled: true,
  earnPointsPerSpend: 100, // Spend Rs. 100 to earn 1 loyalty point (1% cashback value)
  redeemValueInPkr: 1.0, // 1 point = Rs. 1.00 PKR discount or wallet credit
  minPointsToRedeem: 100, // Minimum 100 points required to redeem
  maxOrderRedemptionPercentage: 50, // Up to 50% of bill can be covered by points
  pointsValidityMonths: 12, // Valid for 12 months
  allowWalletConversion: true, // Customers can convert points into Rainbow Wallet cash
  tiers: [
    {
      id: 'tier-1',
      name: 'Bronze Member',
      color: '#cd7f32',
      icon: 'solar:medal-star-bold',
      minPoints: 0,
      pointsMultiplier: 1.0,
      perks: ['1 Point per Rs. 100 spent', 'Member-only promotional deals', 'Digital receipt in App'],
      membersCount: 18240,
    },
    {
      id: 'tier-2',
      name: 'Silver Preferred',
      color: '#9e9e9e',
      icon: 'solar:medal-ribbons-star-bold',
      minPoints: 1000,
      pointsMultiplier: 1.25,
      perks: ['1.25x Points on all purchases', '5% Birthday discount voucher', 'Free home delivery on orders > Rs. 2,000'],
      membersCount: 5210,
    },
    {
      id: 'tier-3',
      name: 'Gold VIP Member',
      color: '#f57f17',
      icon: 'solar:crown-bold',
      minPoints: 3000,
      pointsMultiplier: 1.5,
      perks: ['1.5x Points on all purchases', 'Priority Express Checkout counter', 'Free delivery on all orders', 'Double points on Weekend Fresh Produce'],
      membersCount: 700,
    },
  ],
  branchMultipliers: [
    {
      id: 'bm-1',
      branchName: 'Rainbow Superstore - Clifton, Karachi',
      multiplier: 2.0,
      dayOfWeek: 'Every Friday',
      category: 'Fresh Fruits & Vegetables',
      isActive: true,
    },
    {
      id: 'bm-2',
      branchName: 'Rainbow Cash & Carry - Valencia, Lahore',
      multiplier: 2.0,
      dayOfWeek: 'Every Weekend',
      category: 'Meat, Poultry & Dairy',
      isActive: true,
    },
    {
      id: 'bm-3',
      branchName: 'Rainbow Superstore - Gulshan, Karachi',
      multiplier: 1.5,
      dayOfWeek: 'Every Tuesday',
      category: 'Bakery & Breakfast Essentials',
      isActive: true,
    },
    {
      id: 'bm-4',
      branchName: 'Rainbow Cash & Carry - Wapda Town, Lahore',
      multiplier: 2.0,
      dayOfWeek: 'Every Sunday',
      category: 'All Store Departments',
      isActive: true,
    },
  ],
};

export const MOCK_CUSTOMER_LOYALTY_RECORDS: CustomerLoyaltyRecord[] = [
  {
    customerId: 'CUST-1001',
    customerName: 'Jamal',
    customerCode: 'J4A2M4A3L792',
    phone: '+923009496195',
    email: 'sowangri@gmail.com',
    preferredBranch: 'Rainbow Superstore - Clifton, Karachi',
    tier: 'Gold VIP Member',
    currentPoints: 4850,
    pointsValueInPkr: 4850,
    totalPointsEarned: 8900,
    totalPointsRedeemed: 4050,
    lastActivityDate: '2026-10-14',
    history: [
      { id: 'LP-9102', date: '2026-10-14', type: 'Earned', points: 134, amountPkr: 8950, description: 'Order #32440150 Checkout (1.5x Gold Tier)', branch: 'Clifton Superstore' },
      { id: 'LP-9081', date: '2026-10-04', type: 'Converted to Wallet', points: -1000, amountPkr: 1000, description: 'Transferred 1,000 Points into Rainbow Wallet', branch: 'App Wallet' },
      { id: 'LP-8990', date: '2026-09-28', type: 'Redeemed', points: -500, amountPkr: 500, description: 'Direct Rs. 500 Discount on Order #32435110', branch: 'Clifton Superstore' },
      { id: 'LP-8840', date: '2026-09-15', type: 'Admin Bonus', points: 500, amountPkr: 500, description: 'VIP Loyalty Anniversary Reward', branch: 'Head Office' },
    ],
  },
  {
    customerId: 'CUST-1008',
    customerName: 'Dr. Maria Asif',
    customerCode: 'CLF-88192',
    phone: '+923019876543',
    email: 'dr.maria.asif@gmail.com',
    preferredBranch: 'Rainbow Superstore - DHA Phase 6, Karachi',
    tier: 'Silver Preferred',
    currentPoints: 1890,
    pointsValueInPkr: 1890,
    totalPointsEarned: 3200,
    totalPointsRedeemed: 1310,
    lastActivityDate: '2026-10-12',
    history: [
      { id: 'LP-8711', date: '2026-10-12', type: 'Earned', points: 111, amountPkr: 8900, description: 'Order #32439982 Checkout', branch: 'DHA Phase 6' },
      { id: 'LP-8650', date: '2026-09-20', type: 'Redeemed', points: -500, amountPkr: 500, description: 'Checkout Points Redemption', branch: 'DHA Phase 6' },
    ],
  },
  {
    customerId: 'CUST-1006',
    customerName: 'Zubair Ahmed',
    customerCode: 'VAL-77291',
    phone: '+923004567890',
    email: 'zubair.ahmed@gmail.com',
    preferredBranch: 'Rainbow Cash & Carry - Valencia, Lahore',
    tier: 'Bronze Member',
    currentPoints: 620,
    pointsValueInPkr: 620,
    totalPointsEarned: 1150,
    totalPointsRedeemed: 530,
    lastActivityDate: '2026-10-06',
    history: [
      { id: 'LP-8420', date: '2026-10-06', type: 'Earned', points: 28, amountPkr: 1850, description: 'Order #RH-98234 Checkout', branch: 'Valencia Cash & Carry' },
      { id: 'LP-8390', date: '2026-09-22', type: 'Converted to Wallet', points: -200, amountPkr: 200, description: 'Wallet Transfer', branch: 'App Wallet' },
    ],
  },
  {
    customerId: 'CUST-1010',
    customerName: 'Sadaf Naeem',
    phone: '+923126789012',
    email: 'sadaf.naeem@gmail.com',
    preferredBranch: 'Rainbow Superstore - Gulshan, Karachi',
    tier: 'Bronze Member',
    currentPoints: 470,
    pointsValueInPkr: 470,
    totalPointsEarned: 670,
    totalPointsRedeemed: 200,
    lastActivityDate: '2026-10-10',
    history: [
      { id: 'LP-8201', date: '2026-10-10', type: 'Earned', points: 72, amountPkr: 7200, description: 'Order #32439702 Checkout', branch: 'Gulshan Superstore' },
    ],
  },
  {
    customerId: 'CUST-1007',
    customerName: 'Arooj Hammad',
    customerCode: 'VAL-32440',
    phone: '+923217271204',
    email: 'arooj.icma@gmail.com',
    preferredBranch: 'Rainbow Cash & Carry - Valencia, Lahore',
    tier: 'Bronze Member',
    currentPoints: 340,
    pointsValueInPkr: 340,
    totalPointsEarned: 490,
    totalPointsRedeemed: 150,
    lastActivityDate: '2026-10-14',
    history: [
      { id: 'LP-8110', date: '2026-10-14', type: 'Earned', points: 60, amountPkr: 5957, description: 'Order #32440315 Checkout', branch: 'Valencia Cash & Carry' },
    ],
  },
  {
    customerId: 'CUST-1009',
    customerName: 'Bilal Tariq',
    phone: '+923225544332',
    email: 'bilal.tariq@yahoo.com',
    preferredBranch: 'Rainbow Cash & Carry - Canal Road, Lahore',
    tier: 'Bronze Member',
    currentPoints: 80,
    pointsValueInPkr: 80,
    totalPointsEarned: 80,
    totalPointsRedeemed: 0,
    lastActivityDate: '2026-10-11',
    history: [
      { id: 'LP-8012', date: '2026-10-11', type: 'Earned', points: 38, amountPkr: 3800, description: 'Order #32439811 Checkout', branch: 'Canal Road' },
    ],
  },
  {
    customerId: 'CUST-1003',
    customerName: 'usman',
    phone: '+923066666203',
    email: 'usman_zameer17@yahoo.com',
    preferredBranch: 'Rainbow Cash & Carry - Valencia, Lahore',
    tier: 'Bronze Member',
    currentPoints: 10,
    pointsValueInPkr: 10,
    totalPointsEarned: 10,
    totalPointsRedeemed: 0,
    lastActivityDate: '2023-07-11',
    history: [
      { id: 'LP-7001', date: '2023-07-11', type: 'Earned', points: 10, amountPkr: 995, description: 'First Order Bonus', branch: 'Valencia' },
    ],
  },
];

export interface WalletTransactionEntry {
  id: string;
  date: string;
  time: string;
  type: 'Top-up' | 'Order Checkout' | 'Cashback Bonus' | 'Order Refund' | 'Admin Adjustment' | 'Points Conversion';
  isCredit: boolean;
  amount: number;
  balanceAfter: number;
  reference: string;
  channel: 'App Online' | 'POS Counter' | 'Customer Care' | 'Automated System';
  branch: string;
}

export interface CustomerWalletAccount {
  customerId: string;
  customerName: string;
  customerCode?: string;
  phone: string;
  email: string;
  preferredBranch: string;
  city: string;
  isVip: boolean;
  walletStatus: 'Active' | 'Frozen';
  currentBalance: number; // PKR
  lifetimeTopups: number;
  lifetimeSpend: number;
  totalCashbackReceived: number;
  lastTransactionDate: string;
  transactions: WalletTransactionEntry[];
}

export interface WalletSystemConfig {
  isEnabled: boolean;
  autoRefundReturnToWallet: boolean; // Instant refund to wallet
  topupBonusThreshold: number; // Spend Rs. 5,000 topup
  topupBonusPercent: number; // 5% extra cashback
  orderCashbackPercent: number; // 2% cashback on online orders
  maxWalletBalanceLimit: number; // Rs. 50,000
  minTopupAmount: number; // Rs. 500
  promotionalCashbackValidityDays: number; // 90 days
  totalFloatCirculation: number;
  monthlyTopups: number;
  monthlySpend: number;
  monthlyCashbackAwarded: number;
  activeWalletsCount: number;
}

export const MOCK_WALLET_CONFIG: WalletSystemConfig = {
  isEnabled: true,
  autoRefundReturnToWallet: true,
  topupBonusThreshold: 5000,
  topupBonusPercent: 5,
  orderCashbackPercent: 2,
  maxWalletBalanceLimit: 50000,
  minTopupAmount: 500,
  promotionalCashbackValidityDays: 90,
  totalFloatCirculation: 2840500,
  monthlyTopups: 950200,
  monthlySpend: 810400,
  monthlyCashbackAwarded: 140800,
  activeWalletsCount: 8420,
};

export const MOCK_CUSTOMER_WALLETS: CustomerWalletAccount[] = [
  {
    customerId: 'CUST-1001',
    customerName: 'Jamal',
    customerCode: 'J4A2M4A3L792',
    phone: '+923009496195',
    email: 'sowangri@gmail.com',
    preferredBranch: 'Rainbow Superstore - Clifton, Karachi',
    city: 'Karachi',
    isVip: true,
    walletStatus: 'Active',
    currentBalance: 12450.00,
    lifetimeTopups: 65000.00,
    lifetimeSpend: 55400.00,
    totalCashbackReceived: 2850.00,
    lastTransactionDate: '2026-10-10',
    transactions: [
      { id: 'WT-991', date: '2026-10-10', time: '02:30 PM', type: 'Cashback Bonus', isCredit: true, amount: 500, balanceAfter: 12450, reference: 'Weekend Grocery Promo', channel: 'Automated System', branch: 'Clifton Superstore' },
      { id: 'WT-982', date: '2026-10-04', time: '11:15 AM', type: 'Order Checkout', isCredit: false, amount: 2000, balanceAfter: 11950, reference: 'Order #32438920 Checkout', channel: 'App Online', branch: 'Clifton Superstore' },
      { id: 'WT-970', date: '2026-09-28', time: '06:40 PM', type: 'Top-up', isCredit: true, amount: 10000, balanceAfter: 13950, reference: 'JazzCash Instant Top-up', channel: 'App Online', branch: 'Clifton Superstore' },
      { id: 'WT-955', date: '2026-09-18', time: '04:10 PM', type: 'Points Conversion', isCredit: true, amount: 1000, balanceAfter: 3950, reference: '1,000 Loyalty Points Converted', channel: 'App Online', branch: 'Head Office' },
    ],
  },
  {
    customerId: 'CUST-1008',
    customerName: 'Dr. Maria Asif',
    customerCode: 'CLF-88192',
    phone: '+923019876543',
    email: 'dr.maria.asif@gmail.com',
    preferredBranch: 'Rainbow Superstore - DHA Phase 6, Karachi',
    city: 'Karachi',
    isVip: true,
    walletStatus: 'Active',
    currentBalance: 3200.00,
    lifetimeTopups: 28000.00,
    lifetimeSpend: 25740.00,
    totalCashbackReceived: 940.00,
    lastTransactionDate: '2026-10-12',
    transactions: [
      { id: 'WT-540', date: '2026-10-12', time: '05:20 PM', type: 'Order Refund', isCredit: true, amount: 940, balanceAfter: 3200, reference: 'Damaged item refund (Tea)', channel: 'Customer Care', branch: 'DHA Phase 6' },
      { id: 'WT-520', date: '2026-10-02', time: '01:45 PM', type: 'Order Checkout', isCredit: false, amount: 4500, balanceAfter: 2260, reference: 'Order #32431201', channel: 'App Online', branch: 'DHA Phase 6' },
      { id: 'WT-501', date: '2026-09-25', time: '10:00 AM', type: 'Top-up', isCredit: true, amount: 5000, balanceAfter: 6760, reference: 'Counter Cash Deposit', channel: 'POS Counter', branch: 'DHA Phase 6' },
    ],
  },
  {
    customerId: 'CUST-1006',
    customerName: 'Zubair Ahmed',
    customerCode: 'VAL-77291',
    phone: '+923004567890',
    email: 'zubair.ahmed@gmail.com',
    preferredBranch: 'Rainbow Cash & Carry - Valencia, Lahore',
    city: 'Lahore',
    isVip: true,
    walletStatus: 'Active',
    currentBalance: 1850.00,
    lifetimeTopups: 15000.00,
    lifetimeSpend: 13330.00,
    totalCashbackReceived: 180.00,
    lastTransactionDate: '2026-10-06',
    transactions: [
      { id: 'WT-801', date: '2026-10-06', time: '03:10 PM', type: 'Order Refund', isCredit: true, amount: 180, balanceAfter: 1850, reference: 'Item Return Refund: Guavas', channel: 'Customer Care', branch: 'Valencia Superstore' },
      { id: 'WT-789', date: '2026-10-06', time: '02:00 PM', type: 'Order Checkout', isCredit: false, amount: 1850, balanceAfter: 1670, reference: 'Order #RH-98234 Payment', channel: 'App Online', branch: 'Valencia Superstore' },
      { id: 'WT-750', date: '2026-10-01', time: '09:30 AM', type: 'Top-up', isCredit: true, amount: 2000, balanceAfter: 3520, reference: 'Easypaisa Mobile Deposit', channel: 'App Online', branch: 'Valencia Superstore' },
    ],
  },
  {
    customerId: 'CUST-1010',
    customerName: 'Sadaf Naeem',
    phone: '+923126789012',
    email: 'sadaf.naeem@gmail.com',
    preferredBranch: 'Rainbow Superstore - Gulshan, Karachi',
    city: 'Karachi',
    isVip: false,
    walletStatus: 'Active',
    currentBalance: 890.00,
    lifetimeTopups: 8000.00,
    lifetimeSpend: 7405.00,
    totalCashbackReceived: 295.00,
    lastTransactionDate: '2026-10-10',
    transactions: [
      { id: 'WT-410', date: '2026-10-10', time: '04:15 PM', type: 'Order Refund', isCredit: true, amount: 295, balanceAfter: 890, reference: 'Pack item refund: Milkpak', channel: 'Customer Care', branch: 'Gulshan Superstore' },
      { id: 'WT-402', date: '2026-09-29', time: '11:20 AM', type: 'Order Checkout', isCredit: false, amount: 3200, balanceAfter: 595, reference: 'Order #32429811', channel: 'App Online', branch: 'Gulshan Superstore' },
    ],
  },
  {
    customerId: 'CUST-1007',
    customerName: 'Arooj Hammad',
    customerCode: 'VAL-32440',
    phone: '+923217271204',
    email: 'arooj.icma@gmail.com',
    preferredBranch: 'Rainbow Cash & Carry - Valencia, Lahore',
    city: 'Lahore',
    isVip: false,
    walletStatus: 'Active',
    currentBalance: 420.00,
    lifetimeTopups: 6000.00,
    lifetimeSpend: 6000.00,
    totalCashbackReceived: 420.00,
    lastTransactionDate: '2026-10-14',
    transactions: [
      { id: 'WT-621', date: '2026-10-14', time: '01:00 PM', type: 'Cashback Bonus', isCredit: true, amount: 420, balanceAfter: 420, reference: 'Cashback Reward on First Order', channel: 'Automated System', branch: 'Valencia Superstore' },
    ],
  },
  {
    customerId: 'CUST-1003',
    customerName: 'usman',
    phone: '+923066666203',
    email: 'usman_zameer17@yahoo.com',
    preferredBranch: 'Rainbow Cash & Carry - Valencia, Lahore',
    city: 'Lahore',
    isVip: false,
    walletStatus: 'Active',
    currentBalance: 50.00,
    lifetimeTopups: 1000.00,
    lifetimeSpend: 1000.00,
    totalCashbackReceived: 50.00,
    lastTransactionDate: '2023-07-11',
    transactions: [
      { id: 'WT-101', date: '2023-07-11', time: '06:00 PM', type: 'Cashback Bonus', isCredit: true, amount: 50, balanceAfter: 50, reference: 'Welcome Bonus', channel: 'Automated System', branch: 'Valencia' },
    ],
  },
  {
    customerId: 'CUST-1009',
    customerName: 'Bilal Tariq',
    phone: '+923225544332',
    email: 'bilal.tariq@yahoo.com',
    preferredBranch: 'Rainbow Cash & Carry - Canal Road, Lahore',
    city: 'Lahore',
    isVip: false,
    walletStatus: 'Frozen', // Frozen due to policy violation
    currentBalance: 0.00,
    lifetimeTopups: 3800.00,
    lifetimeSpend: 3800.00,
    totalCashbackReceived: 0.00,
    lastTransactionDate: '2026-10-11',
    transactions: [],
  },
  {
    customerId: 'CUST-1002',
    customerName: 'Tahir',
    phone: '+923257980625',
    email: 'tahir.urdu@gmail.com',
    preferredBranch: 'Rainbow Cash & Carry - Wapda Town, Lahore',
    city: 'Lahore',
    isVip: false,
    walletStatus: 'Active',
    currentBalance: 0.00,
    lifetimeTopups: 0.00,
    lifetimeSpend: 0.00,
    totalCashbackReceived: 0.00,
    lastTransactionDate: 'Never',
    transactions: [],
  },
];
