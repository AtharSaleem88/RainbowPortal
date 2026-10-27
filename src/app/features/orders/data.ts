import type { StateType } from '@component/state-card/state-card';
import type {
  OrderLifecycleStatus,
  PriorityTier,
  OrderPriorityDetails,
  OrderException,
  OrderUrgency
} from '@core/models/workflow.model';

export type { OrderLifecycleStatus, PriorityTier, OrderPriorityDetails, OrderException, OrderUrgency };

export interface SpecificReplacementChoice {
  name: string;
  price: number;
  image?: string;
  sku?: string;
}

export interface RainbowOrderItem {
  itemId: string;
  name: string;
  barcode: string;
  sku: string;
  image: string;
  orderedQty: number;
  deliveredQty: number;
  originalPrice: number;
  discountPercent: number;
  finalPrice: number;
  totalPrice: number;
  isOverridden?: boolean;
  // Out of stock & customer substitution options (matching customer app)
  isOutOfStock?: boolean;
  substitutionOption?: 'specific_item' | 'best_match' | 'notify_me';
  specificReplacements?: SpecificReplacementChoice[];
  substitutionStatus?: 'None' | 'Substituted' | 'Removed' | 'Pending Choice';
  originalItemName?: string;
  originalItemPrice?: number;
  substituteItemName?: string;
  substituteItemPrice?: number;
  substituteSku?: string;
}

export interface AssignedDispatcher {
  id: string; // e.g. 'DSP-VAL-01'
  name: string; // 'Haris Mehmood'
  bayNumber: string; // 'Staging Bay 1'
  assignedAt: string;
  phone?: string;
  avatar?: string;
  status?: 'Queued' | 'Picking' | 'Ready to Pick';
}

export interface AssignedRider {
  id: string; // e.g. 'RDR-VAL-101'
  name: string;
  phone: string;
  avatar?: string;
  vehicleType: 'Motorbike' | 'Cargo Van' | 'Electric Scooter' | string;
  vehicleRegNo: string;
  rating: number;
  assignedAt: string;
  deliveryStatus?: 'Assigned' | 'Picked Up' | 'En Route' | 'Delivered';
}

export interface RainbowOrder {
  id: string; // e.g. 32440315
  dailyOrderNo: number; // e.g. 29
  uniqueCode: string; // e.g. 'FZNJ-WLUG6'
  source: string; // 'Google' | 'App' | 'Web'
  time: string; // '07:06 PM'
  date: string; // '14/Oct/2026'
  fullTimestamp: string; // '14/10/2026 19:06:39'
  paymentType: 'COD' | 'CAOD' | 'Online';
  paymentChannel: string; // 'COD' | 'CAOD' | 'Online Credit/Debit'
  paymentVerified: boolean;
  branch: string; // 'Rainbow Cash & Carry - Valencia'
  branchCode: string; // 'VAL-01'
  deviceType: 'Android' | 'iOS' | 'Web Browser';
  appVersion?: string; // '1.1.8 + 18'
  status: OrderLifecycleStatus;
  
  // Operational Priority & Urgency
  urgency?: OrderUrgency;
  priorityScore?: number;
  priorityTier?: PriorityTier;
  priorityDetails?: OrderPriorityDetails;

  // Operational Exceptions & Flagged Status
  hasException?: boolean;
  exception?: OrderException;

  // Out-of-Stock & Customer Substitution Preferences
  substitutionPreference?: 'Call Me' | 'Best Alternative' | 'Remove & Refund' | 'Cancel Order';
  substitutionNotes?: string;
  hasOutOfStockItems?: boolean;

  // Delivery slot and queue age
  queueAgeMins?: number;
  deliverySlotWindow?: string;

  // Cancellation & Refund Records
  cancellationReason?: string;
  refundAmount?: number;
  refundStatus?: 'Pending' | 'Approved' | 'Processed' | 'Rejected';
  refundApprovedBy?: string;
  
  // Customer details
  customer: {
    name: string;
    phone: string;
    email: string;
    deliveryAddress: string;
    tradeArea: string;
    totalOrders: number;
    isRepeatCustomer: boolean;
    locationCoordinates?: { lat: number; lng: number };
  };

  // Dispatch & Logistics
  deliveryBy: string; // 'Blink' | 'Rainbow Fleet'
  deliveryTimeType: 'ASAP' | 'Scheduled';
  deliveryEta: string; // '150' mins
  trackingId: string; // 'BLNK-32440315-PK'

  // Store Dispatcher Queue & Verification Flow
  dispatcherQueueStatus?: 'Pending Verification' | 'In Dispatcher Queue' | 'Ready to Pick' | 'Dispatched';
  assignedDispatcher?: AssignedDispatcher;
  verifiedAt?: string;
  queueEntryTime?: string;
  timeInQueueMinutes?: number;
  capacityThresholdPercent?: number;

  // Assigned Branch Rider
  assignedRider?: AssignedRider;

  // Financials
  subtotal: number;
  deliveryFee: number;
  packagingFee: number;
  discount: number;
  totalAmount: number;

  // Items
  items: RainbowOrderItem[];
}

export type CartType = {
  image: string;
  title: string;
  color: string;
  size: string;
  quantity: number;
  item_price: number;
  tax: number;
  total: number;
};

export const StatusData: StateType[] = [
  {
    title: 'Payment Refund',
    icon: 'solar:chat-round-money-broken',
    value: 490,
  },
  {
    title: 'Order Cancel',
    icon: 'solar:cart-cross-broken',
    value: 241,
  },
  {
    title: 'Order Shipped',
    icon: 'solar:box-broken',
    value: 630,
  },
  {
    title: 'Order Delivering',
    icon: 'solar:tram-broken',
    value: 170,
  },
  {
    title: 'Pending Review',
    icon: 'solar:clipboard-remove-broken',
    value: 210,
  },
  {
    title: 'Pending Payment',
    icon: 'solar:clock-circle-broken',
    value: 608,
  },
  {
    title: 'Delivered',
    icon: 'solar:clipboard-check-broken',
    value: 200,
  },
  {
    title: 'In Progress',
    icon: 'solar:inbox-line-broken',
    value: 656,
  },
];

export const RAINBOW_ORDERS: RainbowOrder[] = [
  {
    id: '32440315',
    dailyOrderNo: 29,
    uniqueCode: 'FZNJ-WLUG6',
    source: 'Google',
    time: '07:06 PM',
    date: '14/Oct/2026',
    fullTimestamp: '14/10/2026 19:06:39',
    paymentType: 'COD',
    paymentChannel: 'Cash on Delivery',
    paymentVerified: true,
    branch: 'Rainbow Cash & Carry - Valencia',
    branchCode: 'VAL-01',
    deviceType: 'Android',
    appVersion: '1.1.8 + 18',
    status: 'Dispatch',
    dispatcherQueueStatus: 'Dispatched',
    assignedDispatcher: {
      id: 'DSP-VAL-01',
      name: 'Haris Mehmood',
      bayNumber: 'Staging Bay 1',
      assignedAt: '07:10 PM',
      status: 'Ready to Pick'
    },
    verifiedAt: '07:08 PM',
    queueEntryTime: '07:08 PM',
    timeInQueueMinutes: 7,
    substitutionPreference: 'Best Alternative',
    customer: {
      name: 'Arooj Hammad',
      phone: '+923217271204',
      email: 'arooj.icma@gmail.com',
      deliveryAddress: '134 h block street 6 dha rahbar, DHA Rahbar Phase 2, Lahore',
      tradeArea: 'DHA Rahbar Phase 2',
      totalOrders: 5,
      isRepeatCustomer: true,
      locationCoordinates: { lat: 31.3985, lng: 74.2491 }
    },
    deliveryBy: 'Rainbow Fleet',
    deliveryTimeType: 'ASAP',
    deliveryEta: '35 mins',
    trackingId: 'RDR-VAL-32440315-PK',
    assignedRider: {
      id: 'RDR-VAL-101',
      name: 'Waqas Ali',
      phone: '+923224455667',
      avatar: 'assets/images/users/avatar-3.jpg',
      vehicleType: 'Motorbike',
      vehicleRegNo: 'LEA-2024-4412',
      rating: 4.9,
      assignedAt: '14/Oct/2026 07:15 PM',
      deliveryStatus: 'En Route'
    },
    subtotal: 3585,
    deliveryFee: 250,
    packagingFee: 30,
    discount: 0,
    totalAmount: 5957.00,
    items: [
      {
        itemId: '1276197',
        name: 'Always Maxi Thick Trio Long (30 Pads)',
        barcode: '8001841231280',
        sku: '8001841231280',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=120&auto=format&fit=crop&q=80',
        orderedQty: 1,
        deliveredQty: 1,
        originalPrice: 1149.00,
        discountPercent: 0,
        finalPrice: 1149.00,
        totalPrice: 1149.00,
        isOverridden: true
      },
      {
        itemId: '1276198',
        name: 'Always Maxi Thick Trio Extra Long (26 Pads)',
        barcode: '8001841387993',
        sku: '8001841387993',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=120&auto=format&fit=crop&q=80',
        orderedQty: 1,
        deliveredQty: 1,
        originalPrice: 1094.00,
        discountPercent: 0,
        finalPrice: 1094.00,
        totalPrice: 1094.00,
        isOverridden: true
      },
      {
        itemId: '2027832',
        name: 'Johnsons Baby Lotion Milk+Rice 100Ml',
        barcode: '9556006060346',
        sku: '9556006060346',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=120&auto=format&fit=crop&q=80',
        orderedQty: 1,
        deliveredQty: 1,
        originalPrice: 395.00,
        discountPercent: 0,
        finalPrice: 395.00,
        totalPrice: 395.00,
        isOverridden: true
      },
      {
        itemId: '2524551',
        name: 'Eu Wax Strips Chocolate 12 Extra Large',
        barcode: '8964000045961',
        sku: '8964000045961',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=120&auto=format&fit=crop&q=80',
        orderedQty: 1,
        deliveredQty: 1,
        originalPrice: 549.00,
        discountPercent: 0,
        finalPrice: 549.00,
        totalPrice: 549.00,
        isOverridden: true
      },
      {
        itemId: '1959431',
        name: 'Dal Channa Bareek Premium 1Kg',
        barcode: '76205',
        sku: '76205',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=120&auto=format&fit=crop&q=80',
        orderedQty: 1,
        deliveredQty: 1,
        originalPrice: 279.00,
        discountPercent: 0,
        finalPrice: 279.00,
        totalPrice: 279.00,
        isOverridden: true
      },
      {
        itemId: '2038237',
        name: 'Bajra Premium 1Kg',
        barcode: '76240',
        sku: '76240',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=120&auto=format&fit=crop&q=80',
        orderedQty: 1,
        deliveredQty: 1,
        originalPrice: 119.00,
        discountPercent: 0,
        finalPrice: 119.00,
        totalPrice: 119.00,
        isOverridden: false
      }
    ]
  },
  {
    id: '32440286',
    dailyOrderNo: 28,
    uniqueCode: 'RPSU-ELTE5',
    source: 'Google',
    time: '07:05 PM',
    date: '14/Oct/2026',
    fullTimestamp: '14/10/2026 19:05:14',
    paymentType: 'CAOD',
    paymentChannel: 'Card on Delivery',
    paymentVerified: true,
    branch: 'Rainbow Cash & Carry - Valencia',
    branchCode: 'VAL-01',
    deviceType: 'Web Browser',
    status: 'Pending',
    dispatcherQueueStatus: 'Pending Verification',
    substitutionPreference: 'Call Me',
    substitutionNotes: 'Customer requested phone call (+92 310 4442625) before confirming substitution.',
    hasOutOfStockItems: true,
    customer: {
      name: 'Amal Noor Nizami',
      phone: '+923104442625',
      email: 'amal.noor@gmail.com',
      deliveryAddress: '88 C3 Sector A Engineers Town, defence road. Lahore',
      tradeArea: 'Engineers Town, Lahore',
      totalOrders: 3,
      isRepeatCustomer: true,
      locationCoordinates: { lat: 31.4112, lng: 74.2765 }
    },
    deliveryBy: 'Rainbow Fleet',
    deliveryTimeType: 'ASAP',
    deliveryEta: '120',
    trackingId: 'RBF-32440286-PK',
    subtotal: 7774,
    deliveryFee: 250,
    packagingFee: 0,
    discount: 0,
    totalAmount: 8024.00,
    items: [
      {
        itemId: '3049102',
        name: "Olper's Full Cream Pure Milk (1 Litre x 6)",
        barcode: '8964000100224',
        sku: 'OLP-MLK-1L',
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=120&auto=format&fit=crop&q=80',
        orderedQty: 2,
        deliveredQty: 2,
        originalPrice: 1740.00,
        discountPercent: 5,
        finalPrice: 1650.00,
        totalPrice: 3300.00,
        isOverridden: false
      },
      {
        itemId: '4019283',
        name: 'Dalda Fortified Cooking Oil (5 Litre Tin)',
        barcode: '8964000210041',
        sku: 'DLD-OIL-5L',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=120&auto=format&fit=crop&q=80',
        orderedQty: 1,
        deliveredQty: 1,
        originalPrice: 2850.00,
        discountPercent: 0,
        finalPrice: 2850.00,
        totalPrice: 2850.00,
        isOverridden: false,
        isOutOfStock: true,
        substitutionOption: 'specific_item',
        specificReplacements: [
          {
            name: 'Sufi Banaspati & Cooking Oil (5 Litre Tin)',
            price: 2750.00,
            image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=120&auto=format&fit=crop&q=80',
            sku: 'SUF-OIL-5L'
          },
          {
            name: 'Mezan Canola Cooking Oil (5 Litre Tin)',
            price: 2820.00,
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80',
            sku: 'MZN-OIL-5L'
          },
          {
            name: 'Habib Cooking Oil (5 Litre Tin)',
            price: 2890.00,
            image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=120&auto=format&fit=crop&q=80',
            sku: 'HBB-OIL-5L'
          }
        ],
        substitutionStatus: 'Pending Choice',
        originalItemName: 'Dalda Fortified Cooking Oil (5 Litre Tin)'
      },
      {
        itemId: '4019284',
        name: 'Fresh Organic Guava (1 Kg Pack)',
        barcode: '8964000991201',
        sku: 'GVA-FRSH-1KG',
        image: 'https://images.unsplash.com/photo-1536511135899-7389476eaefc?w=120&auto=format&fit=crop&q=80',
        orderedQty: 1,
        deliveredQty: 1,
        originalPrice: 180.00,
        discountPercent: 0,
        finalPrice: 180.00,
        totalPrice: 180.00,
        isOverridden: false,
        isOutOfStock: true,
        substitutionOption: 'specific_item',
        specificReplacements: [
          {
            name: 'Fresh Farm Spinach (Palak)',
            price: 60.00,
            image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=120&auto=format&fit=crop&q=80',
            sku: 'SPN-FRSH-01'
          },
          {
            name: 'Button Mushrooms Fresh Pack (250g)',
            price: 210.00,
            image: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=120&auto=format&fit=crop&q=80',
            sku: 'MSH-BTN-250G'
          },
          {
            name: 'Pure Farm Milk Yogurt (500g)',
            price: 150.00,
            image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=120&auto=format&fit=crop&q=80',
            sku: 'YGT-FRM-500G'
          }
        ],
        substitutionStatus: 'Pending Choice',
        originalItemName: 'Fresh Organic Guava (1 Kg Pack)'
      },
      {
        itemId: '5029182',
        name: 'Tapal Danedar Family Pack (950g)',
        barcode: '8964000300155',
        sku: 'TPL-DAN-950G',
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=120&auto=format&fit=crop&q=80',
        orderedQty: 1,
        deliveredQty: 1,
        originalPrice: 1624.00,
        discountPercent: 0,
        finalPrice: 1624.00,
        totalPrice: 1624.00,
        isOverridden: false
      }
    ]
  },
  {
    id: '32440180',
    dailyOrderNo: 10,
    uniqueCode: '6A6Q-V6EC9',
    source: 'App',
    time: '07:02 PM',
    date: '14/Oct/2026',
    fullTimestamp: '14/10/2026 19:02:40',
    paymentType: 'COD',
    paymentChannel: 'Cash on Delivery',
    paymentVerified: true,
    branch: 'Rainbow Cash and Carry - Sheikhupura',
    branchCode: 'SKP-01',
    deviceType: 'Android',
    appVersion: '1.1.8 + 18',
    status: 'Confirmed',
    dispatcherQueueStatus: 'In Dispatcher Queue',
    assignedDispatcher: {
      id: 'DSP-SKP-01',
      name: 'Zubair Khan',
      bayNumber: 'Staging Bay 1',
      assignedAt: '07:05 PM',
      status: 'Picking'
    },
    verifiedAt: '07:04 PM',
    queueEntryTime: '07:04 PM',
    timeInQueueMinutes: 6,
    substitutionPreference: 'Best Alternative',
    substitutionNotes: 'Auto-substitute with closest brand/flavor if K&Ns is unavailable.',
    hasOutOfStockItems: true,
    customer: {
      name: 'Kalim Ullah',
      phone: '+923424627939',
      email: 'kalim.sheikhupura@gmail.com',
      deliveryAddress: 'AA mobile shop, Qila Sheikhupura',
      tradeArea: 'Qila Sheikhupura',
      totalOrders: 1,
      isRepeatCustomer: false,
      locationCoordinates: { lat: 31.7131, lng: 73.9783 }
    },
    deliveryBy: 'Rainbow Fleet',
    deliveryTimeType: 'ASAP',
    deliveryEta: '90',
    trackingId: 'RBF-32440180-PK',
    subtotal: 4272,
    deliveryFee: 250,
    packagingFee: 0,
    discount: 0,
    totalAmount: 4522.00,
    items: [
      {
        itemId: '6019284',
        name: "K&N's Chicken Shashlik Skewers (515g)",
        barcode: '8964000410052',
        sku: 'KN-SHASH-515',
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=120&auto=format&fit=crop&q=80',
        orderedQty: 2,
        deliveredQty: 2,
        originalPrice: 1080.00,
        discountPercent: 0,
        finalPrice: 1080.00,
        totalPrice: 2160.00,
        isOverridden: false,
        isOutOfStock: true,
        substitutionOption: 'best_match',
        substitutionStatus: 'Pending Choice',
        originalItemName: "K&N's Chicken Shashlik Skewers (515g)"
      },
      {
        itemId: '6019285',
        name: 'Mon Salwa Crispy Chicken Wings (750g)',
        barcode: '8964000520063',
        sku: 'MS-WINGS-750',
        image: 'https://images.unsplash.com/photo-1527477321005-4d45d724b8c4?w=120&auto=format&fit=crop&q=80',
        orderedQty: 1,
        deliveredQty: 1,
        originalPrice: 1290.00,
        discountPercent: 0,
        finalPrice: 1290.00,
        totalPrice: 1290.00,
        isOverridden: false
      },
      {
        itemId: '6019286',
        name: 'Sufi Canola Cooking Oil (1 Litre Pouch)',
        barcode: '8964000630074',
        sku: 'SF-CAN-1L',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=120&auto=format&fit=crop&q=80',
        orderedQty: 1,
        deliveredQty: 1,
        originalPrice: 822.00,
        discountPercent: 0,
        finalPrice: 822.00,
        totalPrice: 822.00,
        isOverridden: false
      }
    ]
  },
  {
    id: '32440047',
    dailyOrderNo: 18,
    uniqueCode: '7PWZ-VZG27',
    source: 'Google',
    time: '06:59 PM',
    date: '14/Oct/2026',
    fullTimestamp: '14/10/2026 18:59:10',
    paymentType: 'COD',
    paymentChannel: 'Cash on Delivery',
    paymentVerified: true,
    branch: 'Rainbow Cash and Carry - Canal Road',
    branchCode: 'CNR-01',
    deviceType: 'Web Browser',
    status: 'Packed',
    dispatcherQueueStatus: 'Ready to Pick',
    assignedDispatcher: {
      id: 'DSP-CNR-01',
      name: 'Hamza Rafiq',
      bayNumber: 'Staging Bay 1',
      assignedAt: '07:01 PM',
      status: 'Ready to Pick'
    },
    verifiedAt: '07:01 PM',
    queueEntryTime: '07:01 PM',
    timeInQueueMinutes: 10,
    hasOutOfStockItems: true,
    substitutionPreference: 'Call Me',
    substitutionNotes: 'Customer requested: Please notify me if item is out of stock.',
    customer: {
      name: 'Emaan Tariq',
      phone: '+9232324670811',
      email: 'emaan.tariq@gmail.com',
      deliveryAddress: 'Eden value homes street 13 house 37 block B, Eden Value Homes, Lahore',
      tradeArea: 'Eden Value Homes, Lahore',
      totalOrders: 8,
      isRepeatCustomer: true,
      locationCoordinates: { lat: 31.4682, lng: 74.3981 }
    },
    deliveryBy: 'Blink',
    deliveryTimeType: 'ASAP',
    deliveryEta: '60',
    trackingId: 'BLNK-32440047-PK',
    subtotal: 2681,
    deliveryFee: 250,
    packagingFee: 0,
    discount: 0,
    totalAmount: 2931.00,
    items: [
      {
        itemId: '7019281',
        name: 'Dawn Frozen Aloo Paratha (400g 4pcs)',
        barcode: '8964000710081',
        sku: 'DWN-PAR-400',
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=120&auto=format&fit=crop&q=80',
        orderedQty: 2,
        deliveredQty: 2,
        originalPrice: 380.00,
        discountPercent: 0,
        finalPrice: 380.00,
        totalPrice: 760.00,
        isOverridden: false,
        isOutOfStock: true,
        substitutionOption: 'notify_me',
        substitutionStatus: 'Pending Choice',
        originalItemName: 'Dawn Frozen Aloo Paratha (400g 4pcs)'
      },
      {
        itemId: '7019282',
        name: 'Rainbow Farm Fresh Eggs Grade A (Crate of 30)',
        barcode: '8964000820092',
        sku: 'RBN-EGG-30',
        image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=120&auto=format&fit=crop&q=80',
        orderedQty: 1,
        deliveredQty: 1,
        originalPrice: 880.00,
        discountPercent: 0,
        finalPrice: 880.00,
        totalPrice: 880.00,
        isOverridden: false
      },
      {
        itemId: '7019283',
        name: 'Nestle MilkPak Dairy Cream (200ml x 3)',
        barcode: '8964000930103',
        sku: 'NST-CRM-200',
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=120&auto=format&fit=crop&q=80',
        orderedQty: 3,
        deliveredQty: 3,
        originalPrice: 347.00,
        discountPercent: 0,
        finalPrice: 347.00,
        totalPrice: 1041.00,
        isOverridden: false
      }
    ]
  },
  {
    id: '32439922',
    dailyOrderNo: 9,
    uniqueCode: '4J8L-K9M21',
    source: 'Google',
    time: '06:52 PM',
    date: '14/Oct/2026',
    fullTimestamp: '14/10/2026 18:52:05',
    paymentType: 'COD',
    paymentChannel: 'Cash on Delivery',
    paymentVerified: true,
    branch: 'Rainbow Cash and Carry - Sheikhupura',
    branchCode: 'SKP-01',
    deviceType: 'Web Browser',
    status: 'Dispatch',
    customer: {
      name: 'Haris Munir',
      phone: '+923001234567',
      email: 'haris.munir@yahoo.com',
      deliveryAddress: 'House 14, St 2, Civil Lines, Sheikhupura',
      tradeArea: 'Civil Lines, Sheikhupura',
      totalOrders: 2,
      isRepeatCustomer: true,
      locationCoordinates: { lat: 31.7145, lng: 73.9850 }
    },
    deliveryBy: 'Rainbow Fleet',
    deliveryTimeType: 'Scheduled',
    deliveryEta: '45',
    trackingId: 'RBF-32439922-PK',
    subtotal: 1474,
    deliveryFee: 200,
    packagingFee: 0,
    discount: 0,
    totalAmount: 1674.00,
    items: [
      {
        itemId: '8019281',
        name: 'Shan Special Bombay Biryani Masala (50g x 2)',
        barcode: '8964001010114',
        sku: 'SHN-BBN-50G',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=120&auto=format&fit=crop&q=80',
        orderedQty: 2,
        deliveredQty: 2,
        originalPrice: 220.00,
        discountPercent: 0,
        finalPrice: 220.00,
        totalPrice: 440.00,
        isOverridden: false
      },
      {
        itemId: '8019282',
        name: 'National Basmati Super Kernel Rice (1Kg)',
        barcode: '8964001120125',
        sku: 'NAT-RIC-1KG',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=120&auto=format&fit=crop&q=80',
        orderedQty: 1,
        deliveredQty: 1,
        originalPrice: 490.00,
        discountPercent: 0,
        finalPrice: 490.00,
        totalPrice: 490.00,
        isOverridden: false
      },
      {
        itemId: '8019283',
        name: 'Dalda Banaspati Ghee (1 Kg Pouch)',
        barcode: '8964001230136',
        sku: 'DLD-GHE-1KG',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=120&auto=format&fit=crop&q=80',
        orderedQty: 1,
        deliveredQty: 1,
        originalPrice: 544.00,
        discountPercent: 0,
        finalPrice: 544.00,
        totalPrice: 544.00,
        isOverridden: false
      }
    ]
  },
  {
    id: '32439811',
    dailyOrderNo: 8,
    uniqueCode: '2M4X-98PQ1',
    source: 'App',
    time: '06:40 PM',
    date: '14/Oct/2026',
    fullTimestamp: '14/10/2026 18:40:22',
    paymentType: 'CAOD',
    paymentChannel: 'Card on Delivery',
    paymentVerified: true,
    branch: 'Rainbow Superstore - Clifton',
    branchCode: 'CLF-01',
    deviceType: 'iOS',
    appVersion: '1.2.0',
    status: 'Delivered',
    customer: {
      name: 'Dr. Farhan Zaidi',
      phone: '+923339876543',
      email: 'dr.farhan@aku.edu',
      deliveryAddress: 'Apartment 4B, Ocean Towers, Block 4, Clifton, Karachi',
      tradeArea: 'Clifton Block 4',
      totalOrders: 14,
      isRepeatCustomer: true,
      locationCoordinates: { lat: 24.8198, lng: 67.0311 }
    },
    deliveryBy: 'Blink',
    deliveryTimeType: 'ASAP',
    deliveryEta: '0',
    trackingId: 'BLNK-32439811-PK',
    subtotal: 12200,
    deliveryFee: 250,
    packagingFee: 0,
    discount: 0,
    totalAmount: 12450.00,
    items: [
      {
        itemId: '9019281',
        name: 'Rainbow Prime Beef Boneless Cubes (2Kg Fresh)',
        barcode: '8964001340147',
        sku: 'RBN-BEEF-2KG',
        image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=120&auto=format&fit=crop&q=80',
        orderedQty: 2,
        deliveredQty: 2,
        originalPrice: 3200.00,
        discountPercent: 0,
        finalPrice: 3200.00,
        totalPrice: 6400.00,
        isOverridden: false
      },
      {
        itemId: '9019282',
        name: "Olper's Milk Carton (1 Litre x 12)",
        barcode: '8964001450158',
        sku: 'OLP-CRT-12',
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=120&auto=format&fit=crop&q=80',
        orderedQty: 1,
        deliveredQty: 1,
        originalPrice: 3480.00,
        discountPercent: 0,
        finalPrice: 3480.00,
        totalPrice: 3480.00,
        isOverridden: false
      },
      {
        itemId: '9019283',
        name: 'Anchor Cheddar Cheese Block (500g Imported)',
        barcode: '9415007010203',
        sku: 'ANC-CHS-500',
        image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=120&auto=format&fit=crop&q=80',
        orderedQty: 2,
        deliveredQty: 2,
        originalPrice: 1160.00,
        discountPercent: 0,
        finalPrice: 1160.00,
        totalPrice: 2320.00,
        isOverridden: false
      }
    ]
  },
  {
    id: '32439702',
    dailyOrderNo: 7,
    uniqueCode: '8K2M-19PL0',
    source: 'Web',
    time: '06:15 PM',
    date: '14/Oct/2026',
    fullTimestamp: '14/10/2026 18:15:45',
    paymentType: 'Online',
    paymentChannel: 'Online JazzCash / Card',
    paymentVerified: true,
    branch: 'Rainbow Superstore - Gulshan',
    branchCode: 'GSH-01',
    deviceType: 'Web Browser',
    status: 'Delivered',
    customer: {
      name: 'Samina Kashif',
      phone: '+923128765432',
      email: 'samina.kashif@hotmail.com',
      deliveryAddress: 'House B-22, Block 7, Gulshan-e-Iqbal, Karachi',
      tradeArea: 'Gulshan Block 7',
      totalOrders: 6,
      isRepeatCustomer: true,
      locationCoordinates: { lat: 24.9180, lng: 67.0971 }
    },
    deliveryBy: 'Rainbow Fleet',
    deliveryTimeType: 'Scheduled',
    deliveryEta: '0',
    trackingId: 'RBF-32439702-PK',
    subtotal: 7640,
    deliveryFee: 250,
    packagingFee: 0,
    discount: 0,
    totalAmount: 7890.00,
    items: [
      {
        itemId: '9119281',
        name: "K&N's Harisa Kabab (580g)",
        barcode: '8964001560169',
        sku: 'KN-HRS-580',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=120&auto=format&fit=crop&q=80',
        orderedQty: 2,
        deliveredQty: 2,
        originalPrice: 1350.00,
        discountPercent: 0,
        finalPrice: 1350.00,
        totalPrice: 2700.00,
        isOverridden: false
      },
      {
        itemId: '9119282',
        name: 'Menu Foods Peshawari Chapli Kabab (800g)',
        barcode: '8964001670170',
        sku: 'MN-CHPL-800',
        image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=120&auto=format&fit=crop&q=80',
        orderedQty: 2,
        deliveredQty: 2,
        originalPrice: 1420.00,
        discountPercent: 0,
        finalPrice: 1420.00,
        totalPrice: 2840.00,
        isOverridden: false
      },
      {
        itemId: '9119283',
        name: 'Dawn Fortified Milk Bread (Jumbo 800g x 3)',
        barcode: '8964001780181',
        sku: 'DWN-BRD-800',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=120&auto=format&fit=crop&q=80',
        orderedQty: 3,
        deliveredQty: 3,
        originalPrice: 700.00,
        discountPercent: 0,
        finalPrice: 700.00,
        totalPrice: 2100.00,
        isOverridden: false
      }
    ]
  },
  {
    id: '32439610',
    dailyOrderNo: 6,
    uniqueCode: '9X1Q-55RT2',
    source: 'App',
    time: '05:45 PM',
    date: '14/Oct/2026',
    fullTimestamp: '14/10/2026 17:45:10',
    paymentType: 'COD',
    paymentChannel: 'Cash on Delivery',
    paymentVerified: false,
    branch: 'Rainbow Superstore - North Nazimabad',
    branchCode: 'NNZ-01',
    deviceType: 'Android',
    appVersion: '1.1.8 + 18',
    status: 'Rejected',
    customer: {
      name: 'Tariq Mehmood',
      phone: '+923015556677',
      email: 'tariq.mehmood@gmail.com',
      deliveryAddress: 'Flat 12, Al-Madina Heights, Block H, North Nazimabad, Karachi',
      tradeArea: 'North Nazimabad Block H',
      totalOrders: 1,
      isRepeatCustomer: false,
      locationCoordinates: { lat: 24.9392, lng: 67.0422 }
    },
    deliveryBy: 'Rainbow Fleet',
    deliveryTimeType: 'ASAP',
    deliveryEta: '0',
    trackingId: 'RBF-32439610-PK',
    subtotal: 2960,
    deliveryFee: 250,
    packagingFee: 0,
    discount: 0,
    totalAmount: 3210.00,
    items: [
      {
        itemId: '9219281',
        name: 'National Tomato Ketchup (825g Pouch x 2)',
        barcode: '8964001890192',
        sku: 'NAT-KTC-825',
        image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=120&auto=format&fit=crop&q=80',
        orderedQty: 2,
        deliveredQty: 0,
        originalPrice: 580.00,
        discountPercent: 0,
        finalPrice: 580.00,
        totalPrice: 1160.00,
        isOverridden: false
      },
      {
        itemId: '9219282',
        name: 'Dalda Supreme Banaspati (2.5 Kg Polybag)',
        barcode: '8964001900203',
        sku: 'DLD-BNP-25',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=120&auto=format&fit=crop&q=80',
        orderedQty: 1,
        deliveredQty: 0,
        originalPrice: 1800.00,
        discountPercent: 0,
        finalPrice: 1800.00,
        totalPrice: 1800.00,
        isOverridden: false
      }
    ]
  },
  {
    id: '32439504',
    dailyOrderNo: 5,
    uniqueCode: '1A9Z-33LK8',
    source: 'App',
    time: '05:10 PM',
    date: '14/Oct/2026',
    fullTimestamp: '14/10/2026 17:10:05',
    paymentType: 'COD',
    paymentChannel: 'Cash on Delivery',
    paymentVerified: true,
    branch: 'Rainbow Cash & Carry - Valencia',
    branchCode: 'VAL-01',
    deviceType: 'iOS',
    appVersion: '1.2.0',
    status: 'Delivered',
    customer: {
      name: 'Ayesha Bilal',
      phone: '+923214433221',
      email: 'ayesha.bilal@gmail.com',
      deliveryAddress: 'House 45, Sector B, DHA Rahbar, Lahore',
      tradeArea: 'DHA Rahbar Sector B',
      totalOrders: 4,
      isRepeatCustomer: true,
      locationCoordinates: { lat: 31.4011, lng: 74.2530 }
    },
    deliveryBy: 'Blink',
    deliveryTimeType: 'ASAP',
    deliveryEta: '0',
    trackingId: 'BLNK-32439504-PK',
    subtotal: 6180,
    deliveryFee: 250,
    packagingFee: 0,
    discount: 0,
    totalAmount: 6430.00,
    items: [
      {
        itemId: '9319281',
        name: 'Sufi Banaspati with Vitamin A&D (5 Litre Tin)',
        barcode: '8964002010214',
        sku: 'SF-BNP-5L',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=120&auto=format&fit=crop&q=80',
        orderedQty: 1,
        deliveredQty: 1,
        originalPrice: 2850.00,
        discountPercent: 0,
        finalPrice: 2850.00,
        totalPrice: 2850.00,
        isOverridden: false
      },
      {
        itemId: '9319282',
        name: 'Rainbow Farm Fresh Eggs Grade A (Crate of 30)',
        barcode: '8964000820092',
        sku: 'RBN-EGG-30',
        image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=120&auto=format&fit=crop&q=80',
        orderedQty: 2,
        deliveredQty: 2,
        originalPrice: 880.00,
        discountPercent: 0,
        finalPrice: 880.00,
        totalPrice: 1760.00,
        isOverridden: false
      },
      {
        itemId: '9319283',
        name: 'Shan Karahi & Ginger Fried Recipe Mix (100g x 3)',
        barcode: '8964002120225',
        sku: 'SHN-KRH-100',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=120&auto=format&fit=crop&q=80',
        orderedQty: 3,
        deliveredQty: 3,
        originalPrice: 523.00,
        discountPercent: 0,
        finalPrice: 523.00,
        totalPrice: 1570.00,
        isOverridden: false
      }
    ]
  },
  {
    id: '32439401',
    dailyOrderNo: 4,
    uniqueCode: '7F3W-44GH9',
    source: 'Web',
    time: '04:30 PM',
    date: '14/Oct/2026',
    fullTimestamp: '14/10/2026 16:30:18',
    paymentType: 'CAOD',
    paymentChannel: 'Card on Delivery',
    paymentVerified: true,
    branch: 'Rainbow Superstore - DHA Phase 6',
    branchCode: 'DHA-06',
    deviceType: 'Web Browser',
    status: 'Delivered',
    customer: {
      name: 'Salman Butt',
      phone: '+923028899001',
      email: 'salman.butt@outlook.com',
      deliveryAddress: 'House 88/1, 24th Commercial Street, Phase 6, DHA, Karachi',
      tradeArea: 'DHA Phase 6 Commercial',
      totalOrders: 11,
      isRepeatCustomer: true,
      locationCoordinates: { lat: 24.8021, lng: 67.0682 }
    },
    deliveryBy: 'Rainbow Fleet',
    deliveryTimeType: 'ASAP',
    deliveryEta: '0',
    trackingId: 'RBF-32439401-PK',
    subtotal: 8870,
    deliveryFee: 250,
    packagingFee: 0,
    discount: 0,
    totalAmount: 9120.00,
    items: [
      {
        itemId: '9419281',
        name: 'Rainbow In-House Fresh Mutton Leg (1.5Kg Cut)',
        barcode: '8964002230236',
        sku: 'RBN-MUT-15',
        image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=120&auto=format&fit=crop&q=80',
        orderedQty: 1,
        deliveredQty: 1,
        originalPrice: 3800.00,
        discountPercent: 0,
        finalPrice: 3800.00,
        totalPrice: 3800.00,
        isOverridden: false
      },
      {
        itemId: '9419282',
        name: 'Nestle Chaunsa Fruit Nectar Juice (1 Litre x 6)',
        barcode: '8964002340247',
        sku: 'NST-JUC-1L',
        image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=120&auto=format&fit=crop&q=80',
        orderedQty: 2,
        deliveredQty: 2,
        originalPrice: 1950.00,
        discountPercent: 0,
        finalPrice: 1950.00,
        totalPrice: 3900.00,
        isOverridden: false
      },
      {
        itemId: '9419283',
        name: 'National Mixed Pickle in Oil (1Kg Jar)',
        barcode: '8964002450258',
        sku: 'NAT-PCK-1KG',
        image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=120&auto=format&fit=crop&q=80',
        orderedQty: 2,
        deliveredQty: 2,
        originalPrice: 585.00,
        discountPercent: 0,
        finalPrice: 585.00,
        totalPrice: 1170.00,
        isOverridden: false
      }
    ]
  }
];

// Backward-compatibility alias for OrderList
export const OrderList = RAINBOW_ORDERS.map(o => ({
  id: '#' + o.id,
  date: o.date,
  name: o.customer.name,
  priority: o.deliveryTimeType === 'ASAP' ? 'High' : 'Normal',
  amount: o.totalAmount,
  payment_status: o.paymentVerified ? 'Paid' : 'Unpaid',
  quantity: o.items.length,
  tracking_number: o.trackingId,
  order_status: o.status,
}));

export const cartData: CartType[] = [
  {
    image: 'assets/images/product/p-1.png',
    title: 'Rainbow Frozen Chicken Shashlik',
    color: '515g',
    size: 'Standard',
    quantity: 1,
    item_price: 1080.0,
    tax: 0,
    total: 1080.0,
  },
  {
    image: 'assets/images/product/p-5.png',
    title: "Olper's Pure Milk Carton (12 x 1L)",
    color: '12L',
    size: 'Carton',
    quantity: 1,
    item_price: 3480.0,
    tax: 0,
    total: 3480.0,
  },
  {
    image: 'assets/images/product/p-8.png',
    title: 'Dalda Fortified Cooking Oil (5L)',
    color: '5 Litre',
    size: 'Tin',
    quantity: 1,
    item_price: 2850.0,
    tax: 0,
    total: 2850.0,
  },
  {
    image: 'assets/images/product/p-10.png',
    title: 'Tapal Danedar Family Pack',
    color: '950g',
    size: 'Economy',
    quantity: 2,
    item_price: 1624.0,
    tax: 0,
    total: 3248.0,
  },
];

export interface RainbowOrderReturn {
  id: string; // e.g. 'RET-98234-01'
  orderId: string; // e.g. 'RH-98234'
  returnDate: string; // '06/Oct/2026 08:30 PM'
  orderDate: string; // '06/Oct/2026'
  branch: string; // 'Rainbow Cash & Carry - Valencia'
  branchCode: string; // 'VAL-01'
  customer: {
    name: string;
    phone: string;
    email: string;
    deliveryAddress: string;
    totalOrders?: number;
  };
  item: {
    itemId: string;
    name: string;
    image: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  };
  reason: 'Damaged or defective item' | 'Expired near shelf life' | 'Quality issue' | 'Wrong item delivered' | 'Missing seal / pack issue' | 'Missing item from package';
  customerNotes?: string;
  refundAmount: number; // e.g. 150
  refundChannel: 'Rainbow Wallet' | 'Original Payment (Cash/COD)' | 'Bank Account';
  status: 'Pending Review' | 'Approved & Refunded' | 'Rejected';
  moderatorNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export const RAINBOW_RETURNS: RainbowOrderReturn[] = [
  {
    id: 'RET-98234-01',
    orderId: 'RH-98234',
    returnDate: '06/Oct/2026 08:45 PM',
    orderDate: '06/Oct/2026',
    branch: 'Rainbow Cash & Carry - Valencia',
    branchCode: 'VAL-01',
    customer: {
      name: 'Zubair Ahmed',
      phone: '+923004567890',
      email: 'zubair.ahmed@gmail.com',
      deliveryAddress: 'House 42, Block C, Valencia Town, Lahore',
      totalOrders: 8,
    },
    item: {
      itemId: '98234-2',
      name: 'Pure Farm Milk Yogurt',
      image: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=120&auto=format&fit=crop&q=80',
      quantity: 1,
      unitPrice: 150,
      totalPrice: 150,
    },
    reason: 'Damaged or defective item',
    customerNotes: 'The yogurt lid seal was punctured and leaking in the grocery pouch.',
    refundAmount: 150,
    refundChannel: 'Rainbow Wallet',
    status: 'Pending Review',
  },
  {
    id: 'RET-98234-02',
    orderId: 'RH-98234',
    returnDate: '06/Oct/2026 08:50 PM',
    orderDate: '06/Oct/2026',
    branch: 'Rainbow Cash & Carry - Valencia',
    branchCode: 'VAL-01',
    customer: {
      name: 'Zubair Ahmed',
      phone: '+923004567890',
      email: 'zubair.ahmed@gmail.com',
      deliveryAddress: 'House 42, Block C, Valencia Town, Lahore',
      totalOrders: 8,
    },
    item: {
      itemId: '98234-1',
      name: 'Fresh Organic Guava',
      image: 'https://images.unsplash.com/photo-1536511135899-7323b6b6c28e?w=120&auto=format&fit=crop&q=80',
      quantity: 1,
      unitPrice: 180,
      totalPrice: 180,
    },
    reason: 'Quality issue',
    customerNotes: 'One guava was excessively soft and bruised on delivery.',
    refundAmount: 180,
    refundChannel: 'Rainbow Wallet',
    status: 'Approved & Refunded',
    moderatorNotes: 'Produce freshness warranty honored. Refund credited to user wallet.',
    reviewedBy: 'Moderator Imran',
    reviewedAt: '07/Oct/2026 10:15 AM',
  },
  {
    id: 'RET-32440315-01',
    orderId: '32440315',
    returnDate: '14/Oct/2026 07:45 PM',
    orderDate: '14/Oct/2026',
    branch: 'Rainbow Cash & Carry - Valencia',
    branchCode: 'VAL-01',
    customer: {
      name: 'Arooj Hammad',
      phone: '+923217271204',
      email: 'arooj.icma@gmail.com',
      deliveryAddress: '134 h block street 6 dha rahbar, DHA Rahbar Phase 2, Lahore',
      totalOrders: 5,
    },
    item: {
      itemId: '1959431',
      name: 'Dal Channa Bareek Premium 1Kg',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=120&auto=format&fit=crop&q=80',
      quantity: 1,
      unitPrice: 279,
      totalPrice: 279,
    },
    reason: 'Missing seal / pack issue',
    customerNotes: 'Bag corner opened during transit, pulses spilt into parcel bag.',
    refundAmount: 279,
    refundChannel: 'Rainbow Wallet',
    status: 'Pending Review',
  },
  {
    id: 'RET-32440286-01',
    orderId: '32440286',
    returnDate: '14/Oct/2026 07:30 PM',
    orderDate: '14/Oct/2026',
    branch: 'Rainbow Cash & Carry - Sheikhupura',
    branchCode: 'SKP-01',
    customer: {
      name: 'Khurram Shahzad',
      phone: '+923334218899',
      email: 'khurram.shahzad@outlook.com',
      deliveryAddress: 'House 12-B, Civil Lines, Sheikhupura',
      totalOrders: 3,
    },
    item: {
      itemId: '9419283',
      name: 'National Mixed Pickle in Oil (1Kg Jar)',
      image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=120&auto=format&fit=crop&q=80',
      quantity: 1,
      unitPrice: 585,
      totalPrice: 585,
    },
    reason: 'Expired near shelf life',
    customerNotes: 'Expiry date is within next 10 days.',
    refundAmount: 585,
    refundChannel: 'Original Payment (Cash/COD)',
    status: 'Approved & Refunded',
    moderatorNotes: 'Verified near-expiry stock report. Cash voucher dispatched.',
    reviewedBy: 'Store Supervisor Tariq',
    reviewedAt: '14/Oct/2026 08:00 PM',
  },
  {
    id: 'RET-32440150-01',
    orderId: '32440150',
    returnDate: '13/Oct/2026 05:12 PM',
    orderDate: '13/Oct/2026',
    branch: 'Rainbow Superstore - Clifton',
    branchCode: 'CLF-01',
    customer: {
      name: 'Farhan Qureshi',
      phone: '+923458765432',
      email: 'farhan.q@hotmail.com',
      deliveryAddress: 'Apt 4B, Ocean View Towers, Clifton Block 2, Karachi',
      totalOrders: 12,
    },
    item: {
      itemId: '9419262',
      name: 'Surf Excel Quick Wash Detergent Powder 2Kg',
      image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=120&auto=format&fit=crop&q=80',
      quantity: 1,
      unitPrice: 1420,
      totalPrice: 1420,
    },
    reason: 'Wrong item delivered',
    customerNotes: 'I had selected Matic Front Load 2Kg but received regular hand wash variant.',
    refundAmount: 1420,
    refundChannel: 'Rainbow Wallet',
    status: 'Pending Review',
  },
  {
    id: 'RET-32439982-01',
    orderId: '32439982',
    returnDate: '12/Oct/2026 02:45 PM',
    orderDate: '12/Oct/2026',
    branch: 'Rainbow Superstore - DHA Phase 6',
    branchCode: 'DHA-06',
    customer: {
      name: 'Dr. Maria Asif',
      phone: '+923019876543',
      email: 'dr.maria.asif@gmail.com',
      deliveryAddress: 'Bungalow 98/2, Khayaban-e-Seher, DHA Phase 6, Karachi',
      totalOrders: 19,
    },
    item: {
      itemId: '9419275',
      name: 'Lipton Yellow Label Black Tea Bag (100 Pcs)',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=120&auto=format&fit=crop&q=80',
      quantity: 1,
      unitPrice: 940,
      totalPrice: 940,
    },
    reason: 'Damaged or defective item',
    customerNotes: 'Tea carton was squashed flat and tea bags torn.',
    refundAmount: 940,
    refundChannel: 'Rainbow Wallet',
    status: 'Approved & Refunded',
    moderatorNotes: 'Courier transit damage confirmed with delivery logs.',
    reviewedBy: 'Admin Karachi Hub',
    reviewedAt: '12/Oct/2026 03:30 PM',
  },
  {
    id: 'RET-32439811-01',
    orderId: '32439811',
    returnDate: '11/Oct/2026 06:10 PM',
    orderDate: '11/Oct/2026',
    branch: 'Rainbow Cash & Carry - Canal Road',
    branchCode: 'CNR-01',
    customer: {
      name: 'Bilal Tariq',
      phone: '+923225544332',
      email: 'bilal.tariq@yahoo.com',
      deliveryAddress: 'Plot 78, Canal View Housing Society, Lahore',
      totalOrders: 2,
    },
    item: {
      itemId: '9419281',
      name: 'Rainbow In-House Fresh Mutton Leg (1.5Kg Cut)',
      image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=120&auto=format&fit=crop&q=80',
      quantity: 1,
      unitPrice: 3800,
      totalPrice: 3800,
    },
    reason: 'Quality issue',
    customerNotes: 'Customer requested return 24 hours after delivery claiming cut was too fatty.',
    refundAmount: 3800,
    refundChannel: 'Rainbow Wallet',
    status: 'Rejected',
    moderatorNotes: 'Perishable meat policy requires reporting within 2 hours. Inspection photo at dispatch shows prime lean cut.',
    reviewedBy: 'Quality Assurance Lead',
    reviewedAt: '12/Oct/2026 09:15 AM',
  },
  {
    id: 'RET-32439702-01',
    orderId: '32439702',
    returnDate: '10/Oct/2026 11:20 AM',
    orderDate: '10/Oct/2026',
    branch: 'Rainbow Superstore - Gulshan',
    branchCode: 'GSH-01',
    customer: {
      name: 'Sadaf Naeem',
      phone: '+923126789012',
      email: 'sadaf.naeem@gmail.com',
      deliveryAddress: 'Block 13-D, Gulshan-e-Iqbal, Karachi',
      totalOrders: 7,
    },
    item: {
      itemId: '9419267',
      name: 'Nestle Milkpak 1 Litre (Pack of 12)',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=120&auto=format&fit=crop&q=80',
      quantity: 1,
      unitPrice: 295,
      totalPrice: 295,
    },
    reason: 'Damaged or defective item',
    customerNotes: 'One pack out of the 12 carton was pierced.',
    refundAmount: 295,
    refundChannel: 'Rainbow Wallet',
    status: 'Approved & Refunded',
    moderatorNotes: 'Partial pack refund of 1 unit Rs. 295 credited to customer wallet.',
    reviewedBy: 'Moderator Karachi',
    reviewedAt: '10/Oct/2026 12:10 PM',
  },
];

export interface RainbowOrderFeedback {
  id: string; // 'FB-88391'
  orderId: string; // 'RH-98234'
  customer: {
    name: string;
    phone: string;
    email?: string;
    totalOrders: number;
    avatar?: string;
  };
  branch: string;
  branchCode: string;
  date: string; // '14/Oct/2026 06:45 PM'
  rating: number; // 1 to 5
  feedbackType: 'Order & Delivery' | 'Product Quality' | 'Store Packaging' | 'App Experience';
  productMentioned?: string;
  comment: string;
  status: 'Pending Moderation' | 'Approved' | 'Rejected';
  displayOnStorefront: boolean;
  adminReply?: string;
  moderatorNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export const RAINBOW_FEEDBACK: RainbowOrderFeedback[] = [
  {
    id: 'FB-98234-01',
    orderId: 'RH-98234',
    customer: {
      name: 'Zubair Ahmed',
      phone: '+923004567890',
      totalOrders: 8,
    },
    branch: 'Rainbow Cash & Carry - Valencia',
    branchCode: 'VAL-01',
    date: '06/Oct/2026 09:15 PM',
    rating: 4,
    feedbackType: 'Order & Delivery',
    productMentioned: 'Olpers Milk 1L & Guavas',
    comment: 'Delivery rider arrived within 25 minutes! Extremely satisfied with the fast dispatch service. Packaging was neat except one dairy item issue.',
    status: 'Approved',
    displayOnStorefront: true,
    reviewedBy: 'Admin Team',
    reviewedAt: '07/Oct/2026 09:00 AM',
  },
  {
    id: 'FB-32440315-01',
    orderId: '32440315',
    customer: {
      name: 'Arooj Hammad',
      phone: '+923217271204',
      totalOrders: 5,
    },
    branch: 'Rainbow Cash & Carry - Valencia',
    branchCode: 'VAL-01',
    date: '14/Oct/2026 07:40 PM',
    rating: 5,
    feedbackType: 'Product Quality',
    productMentioned: 'Personal Care & Grocery Pack',
    comment: 'All personal care products were authentic and brand new with factory seals intact. Highly recommend Rainbow Valencia online shopping!',
    status: 'Approved',
    displayOnStorefront: true,
    reviewedBy: 'Admin Team',
    reviewedAt: '14/Oct/2026 08:10 PM',
  },
  {
    id: 'FB-32440286-01',
    orderId: '32440286',
    customer: {
      name: 'Khurram Shahzad',
      phone: '+923334218899',
      totalOrders: 3,
    },
    branch: 'Rainbow Cash & Carry - Sheikhupura',
    branchCode: 'SKP-01',
    date: '14/Oct/2026 07:55 PM',
    rating: 3,
    feedbackType: 'Product Quality',
    productMentioned: 'National Mixed Pickle in Oil',
    comment: 'Pickle was safe but best-before date was quite close to purchase date. Kindly check shelf life before dispatching from Sheikhupura branch.',
    status: 'Pending Moderation',
    displayOnStorefront: false,
  },
  {
    id: 'FB-32440150-01',
    orderId: '32440150',
    customer: {
      name: 'Farhan Qureshi',
      phone: '+923458765432',
      totalOrders: 12,
    },
    branch: 'Rainbow Superstore - Clifton',
    branchCode: 'CLF-01',
    date: '13/Oct/2026 05:40 PM',
    rating: 5,
    feedbackType: 'Order & Delivery',
    comment: 'Prompt resolution from customer service when my Surf Excel was exchanged. Excellent courtesy from Rainbow Clifton staff.',
    status: 'Approved',
    displayOnStorefront: true,
    reviewedBy: 'Store Supervisor Clifton',
    reviewedAt: '13/Oct/2026 06:15 PM',
  },
  {
    id: 'FB-32439982-01',
    orderId: '32439982',
    customer: {
      name: 'Dr. Maria Asif',
      phone: '+923019876543',
      totalOrders: 19,
    },
    branch: 'Rainbow Superstore - DHA Phase 6',
    branchCode: 'DHA-06',
    date: '12/Oct/2026 03:00 PM',
    rating: 4,
    feedbackType: 'Store Packaging',
    productMentioned: 'Lipton Yellow Label Black Tea Bag',
    comment: 'Items were credited quickly back into my Rainbow Wallet. Wallet refund system is instant and seamless.',
    status: 'Approved',
    displayOnStorefront: true,
    reviewedBy: 'Admin Team',
    reviewedAt: '12/Oct/2026 04:00 PM',
  },
  {
    id: 'FB-32439811-01',
    orderId: '32439811',
    customer: {
      name: 'Bilal Tariq',
      phone: '+923225544332',
      totalOrders: 2,
    },
    branch: 'Rainbow Cash & Carry - Canal Road',
    branchCode: 'CNR-01',
    date: '11/Oct/2026 06:45 PM',
    rating: 1,
    feedbackType: 'Product Quality',
    comment: 'Very unhelpful policy! Wanted to return fresh meat 24 hours later and refused. Spam store.',
    status: 'Rejected',
    displayOnStorefront: false,
    moderatorNotes: 'Rejected due to derogatory abuse and violation of fresh perishable return guidelines.',
    reviewedBy: 'Content Moderator',
    reviewedAt: '11/Oct/2026 07:15 PM',
  },
  {
    id: 'FB-32439702-01',
    orderId: '32439702',
    customer: {
      name: 'Sadaf Naeem',
      phone: '+923126789012',
      totalOrders: 7,
    },
    branch: 'Rainbow Superstore - Gulshan',
    branchCode: 'GSH-01',
    date: '10/Oct/2026 12:00 PM',
    rating: 5,
    feedbackType: 'Order & Delivery',
    comment: 'Best grocery app in Karachi. Dairy products are always cold and fresh upon arrival. Five stars!',
    status: 'Approved',
    displayOnStorefront: true,
    reviewedBy: 'Admin Team',
    reviewedAt: '10/Oct/2026 01:00 PM',
  },
  {
    id: 'FB-32439655-01',
    orderId: '32439655',
    customer: {
      name: 'Hassan Raza',
      phone: '+923345123998',
      totalOrders: 4,
    },
    branch: 'Rainbow Superstore - Bahria Town',
    branchCode: 'BHR-01',
    date: '09/Oct/2026 04:30 PM',
    rating: 4,
    feedbackType: 'App Experience',
    comment: 'Great app UI, geolocation picked Bahria Town branch accurately without me having to search for it.',
    status: 'Pending Moderation',
    displayOnStorefront: false,
  },
];
