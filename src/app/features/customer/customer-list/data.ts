export interface CustomerOrderSummary {
  orderId: string;
  date: string;
  amount: number;
  status: 'Delivered' | 'Pending' | 'Dispatch' | 'Cancelled';
  branch: string;
  itemsCount: number;
}

export interface WalletTransaction {
  id: string;
  date: string;
  type: 'Credit' | 'Debit';
  amount: number;
  reason: string;
  balanceAfter: number;
}

export interface RainbowCustomer {
  id: string;
  customerCode?: string;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  createdAt: string; // '2023-07-11'
  isVip: boolean;
  isBlacklisted: boolean;
  isRepeatCustomer: boolean;
  segment: 'New Customers' | 'VIP Customers' | 'Repeat Buyers' | 'Zero Orders' | 'Dormant Customers' | 'Frequent Buyers' | 'Cart Abandoners' | 'One-time Buyers';
  
  // Orders
  totalOrders: number;
  totalSpent: number;
  firstOrderDate: string;
  lastOrderDate: string;
  
  // Loyalty & Wallet
  loyaltyPoints: number;
  walletBalance: number; // in PKR
  
  // Address & Branch
  preferredBranch: string;
  deliveryAddress: string;
  city: 'Lahore' | 'Karachi' | 'Sheikhupura';
  
  // History
  recentOrders: CustomerOrderSummary[];
  walletHistory: WalletTransaction[];
}

export const RAINBOW_CUSTOMERS_LIST: RainbowCustomer[] = [
  {
    id: 'CUST-1001',
    customerCode: 'J4A2M4A3L792',
    name: 'Jamal',
    avatar: 'assets/images/users/avatar-1.jpg',
    email: 'sowangri@gmail.com',
    phone: '+923009496195',
    createdAt: '2023-07-11',
    isVip: true,
    isBlacklisted: false,
    isRepeatCustomer: true,
    segment: 'Frequent Buyers',
    totalOrders: 128,
    totalSpent: 490230.00,
    firstOrderDate: '02 August, 2023',
    lastOrderDate: '10 October, 2026',
    loyaltyPoints: 4850,
    walletBalance: 12450.00,
    preferredBranch: 'Rainbow Superstore - Clifton',
    deliveryAddress: 'House 42, Block 4, Clifton, Karachi',
    city: 'Karachi',
    recentOrders: [
      { orderId: '32440150', date: '10/Oct/2026', amount: 8950, status: 'Delivered', branch: 'Clifton Superstore', itemsCount: 14 },
      { orderId: '32438920', date: '04/Oct/2026', amount: 6200, status: 'Delivered', branch: 'Clifton Superstore', itemsCount: 8 },
      { orderId: '32435110', date: '28/Sep/2026', amount: 11400, status: 'Delivered', branch: 'Clifton Superstore', itemsCount: 19 },
    ],
    walletHistory: [
      { id: 'WT-991', date: '10/Oct/2026', type: 'Credit', amount: 500, reason: 'Promotional Cashback', balanceAfter: 12450 },
      { id: 'WT-982', date: '04/Oct/2026', type: 'Debit', amount: 2000, reason: 'Order #32438920 Checkout', balanceAfter: 11950 },
      { id: 'WT-970', date: '28/Sep/2026', type: 'Credit', amount: 1000, reason: 'Rainbow VIP Top-up', balanceAfter: 13950 },
    ],
  },
  {
    id: 'CUST-1002',
    name: 'Tahir',
    avatar: 'assets/images/users/avatar-2.jpg',
    email: 'tahir.urdu@gmail.com',
    phone: '+923257980625',
    createdAt: '2023-07-11',
    isVip: false,
    isBlacklisted: false,
    isRepeatCustomer: false,
    segment: 'Zero Orders',
    totalOrders: 0,
    totalSpent: 0.00,
    firstOrderDate: 'Never',
    lastOrderDate: 'Never',
    loyaltyPoints: 0,
    walletBalance: 0.00,
    preferredBranch: 'Rainbow Cash & Carry - Wapda Town',
    deliveryAddress: 'Wapda Town Phase 1, Lahore',
    city: 'Lahore',
    recentOrders: [],
    walletHistory: [],
  },
  {
    id: 'CUST-1003',
    name: 'usman',
    avatar: 'assets/images/users/avatar-3.jpg',
    email: 'usman_zameer17@yahoo.com',
    phone: '+923066666203',
    createdAt: '2023-07-11',
    isVip: false,
    isBlacklisted: false,
    isRepeatCustomer: false,
    segment: 'One-time Buyers',
    totalOrders: 1,
    totalSpent: 995.00,
    firstOrderDate: '11 July, 2023',
    lastOrderDate: '11 July, 2023',
    loyaltyPoints: 10,
    walletBalance: 50.00,
    preferredBranch: 'Rainbow Cash & Carry - Valencia',
    deliveryAddress: 'Block H, Valencia Town, Lahore',
    city: 'Lahore',
    recentOrders: [
      { orderId: '2981023', date: '11/Jul/2023', amount: 995, status: 'Delivered', branch: 'Valencia Cash & Carry', itemsCount: 3 },
    ],
    walletHistory: [
      { id: 'WT-101', date: '11/Jul/2023', type: 'Credit', amount: 50, reason: 'First Order Welcome Bonus', balanceAfter: 50 },
    ],
  },
  {
    id: 'CUST-1004',
    name: 'Adeel virk Adeel virk',
    avatar: 'assets/images/users/avatar-4.jpg',
    email: 'adeelvirkadeelvirk858@gmail.com',
    phone: '+923214140665',
    createdAt: '2023-07-12',
    isVip: false,
    isBlacklisted: false,
    isRepeatCustomer: false,
    segment: 'Zero Orders',
    totalOrders: 0,
    totalSpent: 0.00,
    firstOrderDate: 'Never',
    lastOrderDate: 'Never',
    loyaltyPoints: 0,
    walletBalance: 0.00,
    preferredBranch: 'Rainbow Cash & Carry - Valencia',
    deliveryAddress: 'Khyaban-e-Amin, Lahore',
    city: 'Lahore',
    recentOrders: [],
    walletHistory: [],
  },
  {
    id: 'CUST-1005',
    name: 'Muhammad Akram Khan',
    avatar: 'assets/images/users/avatar-5.jpg',
    email: 'akramkhan786@gmail.com',
    phone: '+923444723023',
    createdAt: '2023-07-12',
    isVip: false,
    isBlacklisted: false,
    isRepeatCustomer: false,
    segment: 'Zero Orders',
    totalOrders: 0,
    totalSpent: 0.00,
    firstOrderDate: 'Never',
    lastOrderDate: 'Never',
    loyaltyPoints: 0,
    walletBalance: 0.00,
    preferredBranch: 'Rainbow Superstore - Gulshan',
    deliveryAddress: 'Block 7, Gulshan-e-Iqbal, Karachi',
    city: 'Karachi',
    recentOrders: [],
    walletHistory: [],
  },
  {
    id: 'CUST-1006',
    customerCode: 'VAL-77291',
    name: 'Zubair Ahmed',
    avatar: 'assets/images/users/avatar-6.jpg',
    email: 'zubair.ahmed@gmail.com',
    phone: '+923004567890',
    createdAt: '2024-02-14',
    isVip: true,
    isBlacklisted: false,
    isRepeatCustomer: true,
    segment: 'Frequent Buyers',
    totalOrders: 8,
    totalSpent: 54200.00,
    firstOrderDate: '15 February, 2024',
    lastOrderDate: '06 October, 2026',
    loyaltyPoints: 620,
    walletBalance: 1850.00,
    preferredBranch: 'Rainbow Cash & Carry - Valencia',
    deliveryAddress: 'House 42, Block C, Valencia Town, Lahore',
    city: 'Lahore',
    recentOrders: [
      { orderId: 'RH-98234', date: '06/Oct/2026', amount: 1850, status: 'Delivered', branch: 'Valencia Superstore', itemsCount: 6 },
      { orderId: '32431201', date: '22/Sep/2026', amount: 8400, status: 'Delivered', branch: 'Valencia Superstore', itemsCount: 11 },
      { orderId: '32420914', date: '05/Sep/2026', amount: 12500, status: 'Delivered', branch: 'Valencia Superstore', itemsCount: 15 },
    ],
    walletHistory: [
      { id: 'WT-801', date: '06/Oct/2026', type: 'Credit', amount: 180, reason: 'Item Return Refund: Guavas', balanceAfter: 1850 },
      { id: 'WT-789', date: '06/Oct/2026', type: 'Debit', amount: 1850, reason: 'Order #RH-98234 Payment', balanceAfter: 1670 },
      { id: 'WT-750', date: '01/Oct/2026', type: 'Credit', amount: 2000, reason: 'Manual Rainbow Wallet Top-up', balanceAfter: 3520 },
    ],
  },
  {
    id: 'CUST-1007',
    customerCode: 'VAL-32440',
    name: 'Arooj Hammad',
    avatar: 'assets/images/users/avatar-7.jpg',
    email: 'arooj.icma@gmail.com',
    phone: '+923217271204',
    createdAt: '2024-05-18',
    isVip: false,
    isBlacklisted: false,
    isRepeatCustomer: true,
    segment: 'Repeat Buyers',
    totalOrders: 5,
    totalSpent: 32840.00,
    firstOrderDate: '20 May, 2024',
    lastOrderDate: '14 October, 2026',
    loyaltyPoints: 340,
    walletBalance: 420.00,
    preferredBranch: 'Rainbow Cash & Carry - Valencia',
    deliveryAddress: '134 h block street 6 dha rahbar, DHA Rahbar Phase 2, Lahore',
    city: 'Lahore',
    recentOrders: [
      { orderId: '32440315', date: '14/Oct/2026', amount: 5957, status: 'Delivered', branch: 'Valencia Superstore', itemsCount: 6 },
      { orderId: '32429811', date: '29/Sep/2026', amount: 7800, status: 'Delivered', branch: 'Valencia Superstore', itemsCount: 9 },
    ],
    walletHistory: [
      { id: 'WT-621', date: '14/Oct/2026', type: 'Credit', amount: 420, reason: 'Cashback Reward', balanceAfter: 420 },
    ],
  },
  {
    id: 'CUST-1008',
    customerCode: 'CLF-88192',
    name: 'Dr. Maria Asif',
    avatar: 'assets/images/users/avatar-8.jpg',
    email: 'dr.maria.asif@gmail.com',
    phone: '+923019876543',
    createdAt: '2023-11-05',
    isVip: true,
    isBlacklisted: false,
    isRepeatCustomer: true,
    segment: 'Frequent Buyers',
    totalOrders: 19,
    totalSpent: 142600.00,
    firstOrderDate: '12 November, 2023',
    lastOrderDate: '12 October, 2026',
    loyaltyPoints: 1890,
    walletBalance: 3200.00,
    preferredBranch: 'Rainbow Superstore - DHA Phase 6',
    deliveryAddress: 'Bungalow 98/2, Khayaban-e-Seher, DHA Phase 6, Karachi',
    city: 'Karachi',
    recentOrders: [
      { orderId: '32439982', date: '12/Oct/2026', amount: 8900, status: 'Delivered', branch: 'DHA Phase 6 Superstore', itemsCount: 12 },
    ],
    walletHistory: [
      { id: 'WT-540', date: '12/Oct/2026', type: 'Credit', amount: 940, reason: 'Damaged item refund (Tea)', balanceAfter: 3200 },
    ],
  },
  {
    id: 'CUST-1009',
    name: 'Bilal Tariq',
    avatar: 'assets/images/users/avatar-9.jpg',
    email: 'bilal.tariq@yahoo.com',
    phone: '+923225544332',
    createdAt: '2024-03-20',
    isVip: false,
    isBlacklisted: true, // Marked as blacklisted from return policy violation
    isRepeatCustomer: true,
    segment: 'Repeat Buyers',
    totalOrders: 2,
    totalSpent: 7600.00,
    firstOrderDate: '25 March, 2024',
    lastOrderDate: '11 October, 2026',
    loyaltyPoints: 80,
    walletBalance: 0.00,
    preferredBranch: 'Rainbow Cash & Carry - Canal Road',
    deliveryAddress: 'Plot 78, Canal View Housing Society, Lahore',
    city: 'Lahore',
    recentOrders: [
      { orderId: '32439811', date: '11/Oct/2026', amount: 3800, status: 'Delivered', branch: 'Canal Road Superstore', itemsCount: 1 },
    ],
    walletHistory: [],
  },
  {
    id: 'CUST-1010',
    name: 'Sadaf Naeem',
    avatar: 'assets/images/users/avatar-10.jpg',
    email: 'sadaf.naeem@gmail.com',
    phone: '+923126789012',
    createdAt: '2024-01-10',
    isVip: false,
    isBlacklisted: false,
    isRepeatCustomer: true,
    segment: 'Frequent Buyers',
    totalOrders: 7,
    totalSpent: 46900.00,
    firstOrderDate: '15 January, 2024',
    lastOrderDate: '10 October, 2026',
    loyaltyPoints: 470,
    walletBalance: 890.00,
    preferredBranch: 'Rainbow Superstore - Gulshan',
    deliveryAddress: 'Block 13-D, Gulshan-e-Iqbal, Karachi',
    city: 'Karachi',
    recentOrders: [
      { orderId: '32439702', date: '10/Oct/2026', amount: 7200, status: 'Delivered', branch: 'Gulshan Superstore', itemsCount: 8 },
    ],
    walletHistory: [
      { id: 'WT-410', date: '10/Oct/2026', type: 'Credit', amount: 295, reason: 'Pack item refund: Milkpak', balanceAfter: 890 },
    ],
  },
];

// Compatibility export
export const customerData = RAINBOW_CUSTOMERS_LIST.map(c => ({
  avatar: c.avatar || 'assets/images/users/avatar-1.jpg',
  name: c.name,
  invoice: '#INV-' + c.id,
  status: c.totalOrders > 0 ? 'Completed' : 'Pending',
  amountPaid: c.totalSpent,
  amountDue: 0,
  date: c.createdAt,
  paymentMethod: 'Rainbow Wallet',
}));
