export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  activeOrders: number;
}

export interface TrendingItem {
  name: string;
  unit: string;
  orderedCount: number;
  category: string;
}

export const RAINBOW_BRANCHES: Branch[] = [
  { id: 'all', name: 'All Branches (Consolidated 10 Superstores)', city: 'All Locations', address: 'Network-wide Operations', activeOrders: 248 },
  { id: 'b1', name: 'Branch 01 - Gulshan Superstore (Main Hub)', city: 'Karachi', address: 'Block 5, Gulshan-e-Iqbal', activeOrders: 42 },
  { id: 'b2', name: 'Branch 02 - Clifton Superstore (Ocean Mall)', city: 'Karachi', address: 'Block 9, Clifton', activeOrders: 36 },
  { id: 'b3', name: 'Branch 03 - DHA Phase 6 Superstore', city: 'Karachi', address: 'Khayaban-e-Shahbaz, DHA Phase 6', activeOrders: 31 },
  { id: 'b4', name: 'Branch 04 - North Nazimabad Superstore', city: 'Karachi', address: 'Block H, North Nazimabad', activeOrders: 28 },
  { id: 'b5', name: 'Branch 05 - Bahria Town Superstore', city: 'Karachi', address: 'Commercial Area, Bahria Town', activeOrders: 24 },
  { id: 'b6', name: 'Branch 06 - Tariq Road Superstore', city: 'Karachi', address: 'Tariq Road Central', activeOrders: 22 },
  { id: 'b7', name: 'Branch 07 - F.B Area Superstore', city: 'Karachi', address: 'Block 14, Federal B Area', activeOrders: 19 },
  { id: 'b8', name: 'Branch 08 - Hyderi Superstore', city: 'Karachi', address: 'Hyderi Market, North Nazimabad', activeOrders: 18 },
  { id: 'b9', name: 'Branch 09 - Malir Cantt Superstore', city: 'Karachi', address: 'Falcon Complex, Malir Cantt', activeOrders: 15 },
  { id: 'b10', name: 'Branch 10 - PECHS Superstore', city: 'Karachi', address: 'Block 2, PECHS', activeOrders: 13 }
];

export const TRENDING_ITEMS: TrendingItem[] = [
  { name: 'Fresh Potatoes / Aalu', unit: 'Per Kg', orderedCount: 2540, category: 'Vegetables' },
  { name: 'Fresh Onion Red / Lal Piyaz', unit: 'Per Kg', orderedCount: 1804, category: 'Vegetables' },
  { name: 'Sugar', unit: '1Kg', orderedCount: 1520, category: 'Grocery' },
  { name: 'Fresh Cucumber / Kheera', unit: 'Per Kg', orderedCount: 1433, category: 'Vegetables' },
  { name: 'Fresh Tomato / Tamatar', unit: 'Per Kg', orderedCount: 1237, category: 'Vegetables' },
  { name: 'Basmati Super Kernel Rice', unit: '5Kg', orderedCount: 1120, category: 'Grains & Pulses' },
  { name: 'Farm Fresh Eggs', unit: 'Crate of 30', orderedCount: 985, category: 'Dairy & Eggs' },
  { name: "Olper's Full Cream Milk", unit: '1 Litre', orderedCount: 870, category: 'Dairy' }
];

export type StateType = {
  title: string;
  value: string;
  change: string;
  period: string;
  icon: string;
  change_type: string;
};

export const stateData: StateType[] = [
  {
    title: 'Total Orders',
    value: '13,647',
    change: '2.3%',
    period: 'Last Week',
    icon: 'solar:cart-5-bold',
    change_type: 'increase',
  },
  {
    title: 'New Leads',
    value: '9,526',
    change: '8.1%',
    period: 'Last Month',
    icon: 'solar:user-speak-rounded-bold',
    change_type: 'increase',
  },
  {
    title: 'Deals',
    value: '976',
    change: '0.3%',
    period: 'Last Month',
    icon: 'solar:cup-star-bold',
    change_type: 'decrease',
  },
  {
    title: 'Booked Revenue',
    value: '$123.6k',
    change: '10.6%',
    period: 'Last Month',
    icon: 'solar:wallet-money-bold',
    change_type: 'increase',
  },
];
