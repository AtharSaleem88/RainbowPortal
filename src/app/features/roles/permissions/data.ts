import { RAINBOW_STAFF_MEMBERS, BranchStaff } from '../../roles/role-list/data';

export interface PermissionItem {
  key: string;
  label: string;
  description: string;
  isDangerous?: boolean;
}

export interface PermissionModule {
  id: string;
  name: string;
  icon: string;
  badgeColor: string;
  description: string;
  permissions: PermissionItem[];
}

export interface RolePermissionDefinition {
  role: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  badgeClass: string;
  allowedKeys: string[];
}

export interface UserPermissionProfile {
  staffId: string;
  staffName: string;
  role: string;
  branchName: string;
  branchCode: string;
  avatar: string;
  email: string;
  phone: string;
  status: string;
  customPermissions: { [key: string]: boolean };
  lastUpdated: string;
}

export const RAINBOW_PERMISSION_MODULES: PermissionModule[] = [
  {
    id: 'orders',
    name: 'Orders & Fulfillment',
    icon: 'solar:bag-smile-bold',
    badgeColor: '#1e88e5',
    description: 'Order processing, packing, dispatch, return authorizations and customer feedback moderation',
    permissions: [
      { key: 'orders.view', label: 'View Branch Orders', description: 'Access order listing, items breakdown and delivery addresses' },
      { key: 'orders.status_update', label: 'Update Order Progress', description: 'Change status from Pending to Confirmed, Packing, and Ready' },
      { key: 'orders.dispatch', label: 'Dispatch to Rider', description: 'Assign orders to delivery riders and generate dispatch manifests' },
      { key: 'orders.cancel', label: 'Cancel Customer Orders', description: 'Authority to cancel unpaid or undeliverable orders', isDangerous: true },
      { key: 'orders.returns_approve', label: 'Approve Returns & Refunds', description: 'Review customer return claims and approve wallet refunds', isDangerous: true },
      { key: 'orders.feedback_moderate', label: 'Moderate Customer Feedback', description: 'Approve or reject customer product reviews and ratings' },
    ],
  },
  {
    id: 'products',
    name: 'Product & Catalog Management',
    icon: 'solar:box-bold',
    badgeColor: '#5e35b1',
    description: 'Product master data, selling prices, stock levels, and category organization',
    permissions: [
      { key: 'products.view', label: 'View Products & Stock', description: 'View supermarket products, SKU codes, and inventory levels' },
      { key: 'products.edit_prices', label: 'Override Selling Prices', description: 'Modify unit prices or apply temporary branch markdowns', isDangerous: true },
      { key: 'products.stock_adjust', label: 'Adjust Physical Stock Counts', description: 'Perform stock adjustments and audit shelf counts' },
      { key: 'products.manage_brands', label: 'Manage Brands & Categories', description: 'Add, update or reassign brands and sub-categories' },
    ],
  },
  {
    id: 'promotions',
    name: 'Promotions & Coupons',
    icon: 'solar:tag-price-bold',
    badgeColor: '#f57f17',
    description: 'Branch discount promotions, multi-buy deals, and customer coupon codes',
    permissions: [
      { key: 'promotions.view', label: 'View Promotions & Coupons', description: 'View active promotional campaigns and discount codes' },
      { key: 'promotions.create_branch', label: 'Launch Branch Promotions', description: 'Create branch-specific bulk discounts or flash sales' },
      { key: 'promotions.create_coupons', label: 'Issue Customer Coupons', description: 'Generate discount vouchers and promo codes', isDangerous: true },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing & Push Notifications',
    icon: 'solar:megaphone-loud-bold',
    badgeColor: '#e91e63',
    description: 'Broadcast push notifications, loyalty points rules, and promotional bonus credits',
    permissions: [
      { key: 'marketing.push_send', label: 'Send Push Notifications', description: 'Broadcast notifications to branch patrons or individual shoppers' },
      { key: 'marketing.loyalty_manage', label: 'Configure Loyalty Program', description: 'Adjust point earning ratios, tier benefits, and multipliers' },
      { key: 'marketing.bulk_cashback', label: 'Distribute Bulk Wallet Cash', description: 'Distribute promotional cash credit to customer segments', isDangerous: true },
    ],
  },
  {
    id: 'customers',
    name: 'Customers & Wallets',
    icon: 'solar:users-group-two-rounded-bold',
    badgeColor: '#00897b',
    description: 'Customer profiles, contact phone numbers, blacklist controls, and wallet balance adjustments',
    permissions: [
      { key: 'customers.view', label: 'View Customer Directory', description: 'Search and inspect customer profiles, orders, and addresses' },
      { key: 'customers.whatsapp', label: 'Direct WhatsApp Customer Support', description: 'Launch direct WhatsApp customer support chats' },
      { key: 'customers.wallet_adjust', label: 'Credit / Debit Rainbow Wallet', description: 'Manually adjust customer wallet balances', isDangerous: true },
      { key: 'customers.loyalty_adjust', label: 'Manual Loyalty Points Adjustment', description: 'Award or deduct customer loyalty reward points' },
      { key: 'customers.blacklist', label: 'Blacklist / Block Customers', description: 'Toggle blacklist switch to block fraudulent users from ordering', isDangerous: true },
    ],
  },
  {
    id: 'branch',
    name: 'Branch Settings & Timings',
    icon: 'solar:shop-2-bold',
    badgeColor: '#43a047',
    description: 'Store operating hours, delivery radius polygons, minimum order thresholds, and POS float',
    permissions: [
      { key: 'branch.view_settings', label: 'View Store Settings', description: 'Inspect store address, geofencing, delivery zones and timings' },
      { key: 'branch.edit_timings', label: 'Modify Operating Hours', description: 'Change opening/closing hours, emergency closures, or slot caps' },
      { key: 'branch.edit_delivery_rules', label: 'Configure Delivery Zones & Fees', description: 'Adjust delivery charges, free shipping thresholds and radius', isDangerous: true },
    ],
  },
  {
    id: 'staff',
    name: 'Staff & Roles Administration',
    icon: 'solar:user-speak-rounded-bold',
    badgeColor: '#d32f2f',
    description: 'Hiring branch staff, assigning shifts, vehicle logs, and security permission management',
    permissions: [
      { key: 'staff.view', label: 'View Branch Staff Directory', description: 'View staff members, shifts, contact numbers and ratings' },
      { key: 'staff.manage', label: 'Add & Edit Branch Staff', description: 'Create new riders, moderators, assign vehicles and emergency contacts' },
      { key: 'staff.permissions_edit', label: 'Configure Role & User Permissions', description: 'Set and authorize role permissions for users and managers', isDangerous: true },
    ],
  },
];

export const RAINBOW_ROLE_DEFINITIONS: RolePermissionDefinition[] = [
  {
    role: 'Admin',
    label: 'Admin',
    description: 'Unrestricted master access with all rights across all branches, operations, orders, and system settings',
    icon: 'solar:shield-star-bold',
    color: '#d32f2f',
    badgeClass: 'bg-danger-subtle text-danger',
    allowedKeys: [
      'orders.view', 'orders.status_update', 'orders.dispatch', 'orders.cancel', 'orders.returns_approve', 'orders.feedback_moderate',
      'products.view', 'products.edit_prices', 'products.stock_adjust', 'products.manage_brands',
      'promotions.view', 'promotions.create_branch', 'promotions.create_coupons',
      'marketing.push_send', 'marketing.loyalty_manage', 'marketing.bulk_cashback',
      'customers.view', 'customers.whatsapp', 'customers.wallet_adjust', 'customers.loyalty_adjust', 'customers.blacklist',
      'branch.view_settings', 'branch.edit_timings', 'branch.edit_delivery_rules',
      'staff.view', 'staff.manage', 'staff.permissions_edit',
    ],
  },
  {
    role: 'Branch Manager',
    label: 'Branch Manager',
    description: 'Can see only his branch operations: branch orders, stock, customers, staff, and branch timings',
    icon: 'solar:shop-2-bold',
    color: '#1e88e5',
    badgeClass: 'bg-primary-subtle text-primary',
    allowedKeys: [
      'orders.view', 'orders.status_update', 'orders.dispatch', 'orders.cancel', 'orders.returns_approve', 'orders.feedback_moderate',
      'products.view', 'products.edit_prices', 'products.stock_adjust',
      'promotions.view', 'promotions.create_branch',
      'customers.view', 'customers.whatsapp', 'customers.wallet_adjust', 'customers.loyalty_adjust', 'customers.blacklist',
      'branch.view_settings', 'branch.edit_timings', 'branch.edit_delivery_rules',
      'staff.view', 'staff.manage',
    ],
  },
  {
    role: 'Moderator',
    label: 'Branch Moderator',
    description: 'Can only see his branch orders and dispatch them, changes status',
    icon: 'solar:checklist-bold',
    color: '#f57f17',
    badgeClass: 'bg-warning-subtle text-warning-emphasis',
    allowedKeys: [
      'orders.view',
      'orders.status_update',
      'orders.dispatch',
    ],
  },
  {
    role: 'Rider',
    label: 'Rider',
    description: 'Can deliver things, can only view the order',
    icon: 'solar:scooter-bold',
    color: '#43a047',
    badgeClass: 'bg-success-subtle text-success',
    allowedKeys: [
      'orders.view',
    ],
  },
];

// Seed user profiles matching existing branch staff
export const INITIAL_USER_PERMISSIONS: UserPermissionProfile[] = [
  {
    staffId: 'ADM-HQ-01',
    staffName: 'Rainbow Administrator',
    role: 'Admin',
    branchName: 'All Branches (Enterprise)',
    branchCode: 'HQ-ALL',
    avatar: 'assets/images/users/avatar-1.jpg',
    email: 'admin@rainbowcc.com.pk',
    phone: '+923000000001',
    status: 'Active',
    customPermissions: {},
    lastUpdated: 'Today at 09:00 AM',
  },
  {
    staffId: 'MGR-VAL-01',
    staffName: 'Muhammad Salman',
    role: 'Branch Manager',
    branchName: 'Rainbow Cash & Carry - Valencia',
    branchCode: 'VAL-01',
    avatar: 'assets/images/users/avatar-1.jpg',
    email: 'salman.valencia@rainbowcc.com.pk',
    phone: '+923214567891',
    status: 'Active',
    customPermissions: {},
    lastUpdated: 'Today at 02:30 PM',
  },
  {
    staffId: 'MOD-VAL-01',
    staffName: 'Imran Tariq',
    role: 'Moderator',
    branchName: 'Rainbow Cash & Carry - Valencia',
    branchCode: 'VAL-01',
    avatar: 'assets/images/users/avatar-2.jpg',
    email: 'imran.t@rainbowcc.com.pk',
    phone: '+923001234567',
    status: 'Active',
    customPermissions: {},
    lastUpdated: '14/Oct/2026',
  },
  {
    staffId: 'RDR-VAL-101',
    staffName: 'Waqas Ali',
    role: 'Rider',
    branchName: 'Rainbow Cash & Carry - Valencia',
    branchCode: 'VAL-01',
    avatar: 'assets/images/users/avatar-3.jpg',
    email: 'waqas.rider@rainbowcc.com.pk',
    phone: '+923129876543',
    status: 'Active',
    customPermissions: {},
    lastUpdated: '12/Oct/2026',
  },
  {
    staffId: 'MGR-CLF-01',
    staffName: 'Farhan Qureshi',
    role: 'Branch Manager',
    branchName: 'Rainbow Superstore - Clifton',
    branchCode: 'CLF-01',
    avatar: 'assets/images/users/avatar-4.jpg',
    email: 'farhan.q@rainbowcc.com.pk',
    phone: '+923331234567',
    status: 'Active',
    customPermissions: {},
    lastUpdated: '10/Oct/2026',
  },
  {
    staffId: 'MOD-CLF-01',
    staffName: 'Zeeshan Baig',
    role: 'Moderator',
    branchName: 'Rainbow Superstore - Clifton',
    branchCode: 'CLF-01',
    avatar: 'assets/images/users/avatar-5.jpg',
    email: 'zeeshan.b@rainbowcc.com.pk',
    phone: '+923015551234',
    status: 'Active',
    customPermissions: {},
    lastUpdated: '11/Oct/2026',
  },
];

// Backward compatibility export
export const permissionData = RAINBOW_PERMISSION_MODULES.flatMap(m =>
  m.permissions.map(p => ({
    task: p.label,
    roles: ['Manager', 'Administrator'],
    date: '10/Oct/2026',
    due_date: 'Active',
  }))
);

export const permissionState = [
  {
    title: 'Staff Roles Defined',
    value: 4,
    icon: 'solar:shield-star-bold-duotone',
  },
  {
    title: 'Total Permissions',
    value: 24,
    icon: 'solar:key-minimalistic-square-3-bold-duotone',
  },
  {
    title: 'Authorized Staff',
    value: 54,
    icon: 'solar:users-group-two-rounded-bold-duotone',
  },
  {
    title: 'Superstore Branches',
    value: 6,
    icon: 'solar:shop-2-bold-duotone',
  },
];
