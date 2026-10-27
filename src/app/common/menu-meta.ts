export type MenuItem = {
  key?: string
  label?: string
  icon?: string
  link?: string
  collapsed?: boolean
  subMenu?: any
  isTitle?: boolean
  badge?: any
  parentKey?: string
  disabled?: boolean
  roles?: ('Admin' | 'Branch Manager' | 'Moderator')[]
}

export const MENU: MenuItem[] = [
  {
    key: 'operations-title',
    label: 'OPERATIONS & MONITORING',
    isTitle: true,
    roles: ['Admin', 'Branch Manager', 'Moderator'],
  },
  {
    key: 'dashboards',
    icon: 'solar:widget-5-bold-duotone',
    label: 'Operations Dashboard',
    link: '/index',
    roles: ['Admin', 'Branch Manager', 'Moderator'],
  },
  {
    key: 'catalog-title',
    label: 'CATALOG & BRANDS',
    isTitle: true,
    roles: ['Admin'],
  },
  {
    key: 'category',
    icon: 'solar:layers-minimalistic-bold-duotone',
    label: 'Catalog Hierarchy',
    collapsed: false,
    roles: ['Admin'],
    subMenu: [
      {
        key: 'category-master',
        icon: 'solar:folder-with-files-bold-duotone',
        label: 'Master Categories (20)',
        link: '/category/list',
        parentKey: 'category',
        roles: ['Admin'],
      },
      {
        key: 'category-sub',
        icon: 'solar:layers-minimalistic-bold-duotone',
        label: 'Sub Categories',
        link: '/category/sub-category',
        parentKey: 'category',
        roles: ['Admin'],
      },
      {
        key: 'category-sub-sub',
        icon: 'solar:tag-bold-duotone',
        label: 'Sub-Sub & Tags',
        link: '/category/sub-sub-category',
        parentKey: 'category',
        roles: ['Admin'],
      }
    ],
  },
  {
    key: 'brands-menu',
    icon: 'solar:verified-check-bold-duotone',
    label: 'Brand Management',
    link: '/category/brands',
    roles: ['Admin'],
  },
  {
    key: 'products-title',
    label: 'PRODUCTS',
    isTitle: true,
    roles: ['Admin'],
  },
  {
    key: 'products',
    icon: 'solar:bag-3-bold-duotone',
    label: 'Product Management',
    link: '/product/list',
    roles: ['Admin'],
  },
  {
    key: 'promotions-title',
    label: 'PROMOTIONS & OFFERS',
    isTitle: true,
    roles: ['Admin', 'Branch Manager'],
  },
  {
    key: 'product-promotions',
    icon: 'solar:tag-price-bold-duotone',
    label: 'Product Promotions',
    link: '/promotions/list',
    roles: ['Admin', 'Branch Manager'],
  },
  {
    key: 'customer-coupons',
    icon: 'solar:ticket-sale-bold-duotone',
    label: 'Customer Coupons',
    link: '/coupons/list',
    roles: ['Admin', 'Branch Manager'],
  },
  {
    key: 'marketing-title',
    label: 'MARKETING & ENGAGEMENT',
    isTitle: true,
    roles: ['Admin'],
  },
  {
    key: 'marketing',
    icon: 'solar:pie-chart-2-bold-duotone',
    label: 'Marketing Hub',
    collapsed: false,
    roles: ['Admin'],
    subMenu: [
      {
        key: 'marketing-push',
        icon: 'solar:bell-bing-bold-duotone',
        label: 'Push Notifications',
        link: '/marketing/push-notifications',
        parentKey: 'marketing',
        roles: ['Admin'],
      },
      {
        key: 'loyalty-points',
        icon: 'solar:star-fall-2-bold-duotone',
        label: 'Loyalty Points Program',
        link: '/marketing/loyalty-points',
        parentKey: 'marketing',
        roles: ['Admin'],
      },
      {
        key: 'customer-wallets',
        icon: 'solar:wallet-2-bold-duotone',
        label: 'Customer Wallets',
        link: '/marketing/wallets',
        parentKey: 'marketing',
        roles: ['Admin'],
      },
    ],
  },
  {
    key: 'orders-title',
    label: 'ORDERS & CUSTOMERS',
    isTitle: true,
    roles: ['Admin', 'Branch Manager', 'Moderator'],
  },
  {
    key: 'orders',
    icon: 'solar:bag-smile-bold-duotone',
    label: 'Orders Management',
    collapsed: false,
    roles: ['Admin', 'Branch Manager', 'Moderator'],
    subMenu: [
      {
        key: 'orders-list',
        icon: 'solar:clipboard-list-bold-duotone',
        label: 'Customer Orders',
        link: '/orders/list',
        parentKey: 'orders',
        roles: ['Admin', 'Branch Manager', 'Moderator'],
      },
      {
        key: 'orders-returns',
        icon: 'solar:restart-bold-duotone',
        label: 'Order Returns',
        link: '/orders/returns',
        parentKey: 'orders',
        roles: ['Admin', 'Branch Manager', 'Moderator'],
      },
      {
        key: 'orders-feedback',
        icon: 'solar:star-circle-bold-duotone',
        label: 'Order Feedback',
        link: '/orders/feedback',
        parentKey: 'orders',
        roles: ['Admin', 'Branch Manager', 'Moderator'],
      },
    ],
  },
  {
    key: 'customer',
    icon: 'solar:users-group-two-rounded-bold-duotone',
    label: 'Customers',
    link: '/customer/list',
    roles: ['Admin', 'Branch Manager'],
  },
  {
    key: 'admin-title',
    label: 'PORTAL ADMINISTRATION',
    isTitle: true,
    roles: ['Admin', 'Branch Manager', 'Moderator'],
  },
  {
    key: 'role',
    icon: 'solar:user-speak-rounded-bold-duotone',
    label: 'Branch Staff & System',
    collapsed: false,
    roles: ['Admin', 'Branch Manager', 'Moderator'],
    subMenu: [
      {
        key: 'branch-management',
        icon: 'solar:shop-2-bold-duotone',
        label: 'Branch Management',
        link: '/role/branches',
        parentKey: 'role',
        roles: ['Admin', 'Branch Manager', 'Moderator'],
      },
      {
        key: 'role-list',
        icon: 'solar:user-id-bold-duotone',
        label: 'Staff Directory',
        link: '/role/list',
        parentKey: 'role',
        roles: ['Admin', 'Branch Manager', 'Moderator'],
      },
      {
        key: 'automation-rules',
        icon: 'solar:settings-minimalistic-bold-duotone',
        label: 'Automation & Thresholds',
        link: '/role/automation',
        parentKey: 'role',
        roles: ['Admin'],
      },
      {
        key: 'audit-logs',
        icon: 'solar:history-bold-duotone',
        label: 'Operational Audit Trail',
        link: '/role/audit-logs',
        parentKey: 'role',
        roles: ['Admin', 'Moderator'],
      },
      {
        key: 'permissions',
        icon: 'solar:shield-keyhole-bold-duotone',
        label: 'Roles & Permissions',
        link: '/role/permissions',
        parentKey: 'role',
        roles: ['Admin'],
      }
    ],
  },
];
