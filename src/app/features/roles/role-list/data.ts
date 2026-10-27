export type StaffRole = 'Branch Manager' | 'Moderator' | 'Rider' | 'Dispatcher';

export interface BranchStaff {
  id: string; // e.g. 'MGR-VAL-01', 'MOD-VAL-02', 'RDR-VAL-101'
  name: string;
  avatar?: string;
  role: StaffRole;
  branchId: string;
  branchName: string;
  branchCode: string;
  city: 'Lahore' | 'Karachi' | 'Sheikhupura';
  email: string;
  phone: string;
  cnic: string;
  shift: 'Morning (08:00 AM - 04:00 PM)' | 'Evening (04:00 PM - 12:00 AM)' | 'Night (12:00 AM - 08:00 AM)' | 'General Full Day';
  status: 'Active' | 'On Delivery' | 'Off Duty' | 'Suspended';
  joiningDate: string;

  // Role-Specific: Rider Attributes
  riderDetails?: {
    vehicleType: 'Motorbike' | 'Cargo Van' | 'Electric Scooter';
    vehicleRegNo: string; // e.g. 'LEA-2024-8841'
    licenseNo: string;
    appAccessPin: string;
    totalDeliveries: number;
    rating: number; // 1-5
    currentOrderId?: string;
    maxCashLimit: number;
  };

  // Role-Specific: Moderator Attributes
  moderatorDetails?: {
    canApproveReturns: boolean;
    canModerateFeedback: boolean;
    canOverridePrices: boolean;
    canCancelOrders: boolean;
    dailyApprovalsCount: number;
  };

  // Role-Specific: Branch Manager Attributes
  managerDetails?: {
    isKeyholder: boolean;
    maxDiscountAuth: number; // in PKR
    directReporteesCount: number;
    emergencyContact: string;
  };

  // Role-Specific: Dispatcher Attributes
  dispatcherDetails?: {
    stagingBay: string; // e.g. 'Staging Bay 1', 'Bay 2'
    assignedStoreBranch: string;
    readyOrdersCount?: number;
    appPin?: string;
  };
}

export const RAINBOW_STAFF_MEMBERS: BranchStaff[] = [
  // --- VALENCIA BRANCH ---
  {
    id: 'MGR-VAL-01',
    name: 'Muhammad Salman',
    avatar: 'assets/images/users/avatar-1.jpg',
    role: 'Branch Manager',
    branchId: 'VAL-01',
    branchName: 'Rainbow Cash & Carry - Valencia',
    branchCode: 'VAL-01',
    city: 'Lahore',
    email: 'salman.valencia@rainbowcc.com.pk',
    phone: '+923214567891',
    cnic: '35202-1249821-3',
    shift: 'General Full Day',
    status: 'Active',
    joiningDate: '15/Jan/2023',
    managerDetails: {
      isKeyholder: true,
      maxDiscountAuth: 2500,
      directReporteesCount: 18,
      emergencyContact: '+923009876543',
    },
  },
  {
    id: 'MOD-VAL-01',
    name: 'Imran Tariq',
    avatar: 'assets/images/users/avatar-2.jpg',
    role: 'Moderator',
    branchId: 'VAL-01',
    branchName: 'Rainbow Cash & Carry - Valencia',
    branchCode: 'VAL-01',
    city: 'Lahore',
    email: 'imran.t@rainbowcc.com.pk',
    phone: '+923001234567',
    cnic: '35201-9876543-1',
    shift: 'Morning (08:00 AM - 04:00 PM)',
    status: 'Active',
    joiningDate: '10/May/2023',
    moderatorDetails: {
      canApproveReturns: true,
      canModerateFeedback: true,
      canOverridePrices: false,
      canCancelOrders: true,
      dailyApprovalsCount: 28,
    },
  },
  {
    id: 'RDR-VAL-101',
    name: 'Waqas Ali',
    avatar: 'assets/images/users/avatar-3.jpg',
    role: 'Rider',
    branchId: 'VAL-01',
    branchName: 'Rainbow Cash & Carry - Valencia',
    branchCode: 'VAL-01',
    city: 'Lahore',
    email: 'waqas.rider@rainbowcc.com.pk',
    phone: '+923224455667',
    cnic: '35202-8877665-9',
    shift: 'Morning (08:00 AM - 04:00 PM)',
    status: 'On Delivery',
    joiningDate: '01/Feb/2024',
    riderDetails: {
      vehicleType: 'Motorbike',
      vehicleRegNo: 'LEA-2024-4412',
      licenseNo: 'DL-LHR-88291',
      appAccessPin: '4821',
      totalDeliveries: 1240,
      rating: 4.9,
      currentOrderId: '32440315',
      maxCashLimit: 50000,
    },
  },
  {
    id: 'RDR-VAL-102',
    name: 'Hamza Bilal',
    avatar: 'assets/images/users/avatar-4.jpg',
    role: 'Rider',
    branchId: 'VAL-01',
    branchName: 'Rainbow Cash & Carry - Valencia',
    branchCode: 'VAL-01',
    city: 'Lahore',
    email: 'hamza.b@rainbowcc.com.pk',
    phone: '+923015566778',
    cnic: '35202-6655443-7',
    shift: 'Evening (04:00 PM - 12:00 AM)',
    status: 'Active',
    joiningDate: '15/Apr/2024',
    riderDetails: {
      vehicleType: 'Motorbike',
      vehicleRegNo: 'LEM-2023-7719',
      licenseNo: 'DL-LHR-99102',
      appAccessPin: '1092',
      totalDeliveries: 890,
      rating: 4.8,
      maxCashLimit: 40000,
    },
  },
  {
    id: 'RDR-VAL-103',
    name: 'Farrukh Javed',
    avatar: 'assets/images/users/avatar-7.jpg',
    role: 'Rider',
    branchId: 'VAL-01',
    branchName: 'Rainbow Cash & Carry - Valencia',
    branchCode: 'VAL-01',
    city: 'Lahore',
    email: 'farrukh.j@rainbowcc.com.pk',
    phone: '+923004411998',
    cnic: '35201-9988112-3',
    shift: 'Morning (08:00 AM - 04:00 PM)',
    status: 'Active',
    joiningDate: '01/Jun/2024',
    riderDetails: {
      vehicleType: 'Motorbike',
      vehicleRegNo: 'LEB-2023-3891',
      licenseNo: 'DL-LHR-77219',
      appAccessPin: '5512',
      totalDeliveries: 420,
      rating: 4.9,
      maxCashLimit: 45000,
    },
  },
  {
    id: 'RDR-VAL-104',
    name: 'Tariq Mehmood',
    avatar: 'assets/images/users/avatar-8.jpg',
    role: 'Rider',
    branchId: 'VAL-01',
    branchName: 'Rainbow Cash & Carry - Valencia',
    branchCode: 'VAL-01',
    city: 'Lahore',
    email: 'tariq.m@rainbowcc.com.pk',
    phone: '+923218899221',
    cnic: '35202-3344112-5',
    shift: 'Night (12:00 AM - 08:00 AM)',
    status: 'Off Duty',
    joiningDate: '10/Jan/2024',
    riderDetails: {
      vehicleType: 'Motorbike',
      vehicleRegNo: 'LEG-2022-7712',
      licenseNo: 'DL-LHR-44102',
      appAccessPin: '8821',
      totalDeliveries: 610,
      rating: 4.6,
      maxCashLimit: 30000,
    },
  },
  {
    id: 'DSP-VAL-01',
    name: 'Haris Mehmood',
    avatar: 'assets/images/users/avatar-5.jpg',
    role: 'Dispatcher',
    branchId: 'VAL-01',
    branchName: 'Rainbow Cash & Carry - Valencia',
    branchCode: 'VAL-01',
    city: 'Lahore',
    email: 'haris.dispatcher@rainbowcc.com.pk',
    phone: '+923015559812',
    cnic: '35202-4412984-1',
    shift: 'Morning (08:00 AM - 04:00 PM)',
    status: 'Active',
    joiningDate: '15/Jan/2024',
    dispatcherDetails: {
      stagingBay: 'Staging Bay 1',
      assignedStoreBranch: 'Rainbow Cash & Carry - Valencia',
      readyOrdersCount: 14,
      appPin: '4192'
    }
  },
  {
    id: 'DSP-VAL-02',
    name: 'Waqas Ahmed',
    avatar: 'assets/images/users/avatar-6.jpg',
    role: 'Dispatcher',
    branchId: 'VAL-01',
    branchName: 'Rainbow Cash & Carry - Valencia',
    branchCode: 'VAL-01',
    city: 'Lahore',
    email: 'waqas.dispatcher@rainbowcc.com.pk',
    phone: '+923027771234',
    cnic: '35202-1198345-3',
    shift: 'Evening (04:00 PM - 12:00 AM)',
    status: 'Active',
    joiningDate: '01/Mar/2024',
    dispatcherDetails: {
      stagingBay: 'Staging Bay 2',
      assignedStoreBranch: 'Rainbow Cash & Carry - Valencia',
      readyOrdersCount: 9,
      appPin: '5810'
    }
  },

  // --- WAPDA TOWN BRANCH ---
  {
    id: 'MGR-WAP-01',
    name: 'Zeeshan Malik',
    avatar: 'assets/images/users/avatar-5.jpg',
    role: 'Branch Manager',
    branchId: 'WAP-01',
    branchName: 'Rainbow Cash & Carry - Wapda Town',
    branchCode: 'WAP-01',
    city: 'Lahore',
    email: 'zeeshan.wapda@rainbowcc.com.pk',
    phone: '+923107779652',
    cnic: '35201-1122334-5',
    shift: 'General Full Day',
    status: 'Active',
    joiningDate: '01/Mar/2022',
    managerDetails: {
      isKeyholder: true,
      maxDiscountAuth: 3000,
      directReporteesCount: 22,
      emergencyContact: '+923001122334',
    },
  },
  {
    id: 'MOD-WAP-01',
    name: 'Ayesha Nadeem',
    avatar: 'assets/images/users/avatar-6.jpg',
    role: 'Moderator',
    branchId: 'WAP-01',
    branchName: 'Rainbow Cash & Carry - Wapda Town',
    branchCode: 'WAP-01',
    city: 'Lahore',
    email: 'ayesha.n@rainbowcc.com.pk',
    phone: '+923334455667',
    cnic: '35202-5544332-2',
    shift: 'Morning (08:00 AM - 04:00 PM)',
    status: 'Active',
    joiningDate: '12/Aug/2023',
    moderatorDetails: {
      canApproveReturns: true,
      canModerateFeedback: true,
      canOverridePrices: true,
      canCancelOrders: true,
      dailyApprovalsCount: 34,
    },
  },
  {
    id: 'RDR-WAP-101',
    name: 'Usman Ghani',
    avatar: 'assets/images/users/avatar-7.jpg',
    role: 'Rider',
    branchId: 'WAP-01',
    branchName: 'Rainbow Cash & Carry - Wapda Town',
    branchCode: 'WAP-01',
    city: 'Lahore',
    email: 'usman.ghani@rainbowcc.com.pk',
    phone: '+923451122334',
    cnic: '35201-7788990-1',
    shift: 'Evening (04:00 PM - 12:00 AM)',
    status: 'Active',
    joiningDate: '20/Jul/2024',
    riderDetails: {
      vehicleType: 'Cargo Van',
      vehicleRegNo: 'LEN-2024-1190',
      licenseNo: 'DL-LHR-66512',
      appAccessPin: '3391',
      totalDeliveries: 620,
      rating: 4.7,
      maxCashLimit: 80000,
    },
  },

  // --- CLIFTON BRANCH ---
  {
    id: 'MGR-CLF-01',
    name: 'Farhan Qasim',
    avatar: 'assets/images/users/avatar-8.jpg',
    role: 'Branch Manager',
    branchId: 'CLF-01',
    branchName: 'Rainbow Superstore - Clifton',
    branchCode: 'CLF-01',
    city: 'Karachi',
    email: 'farhan.clifton@rainbowcc.com.pk',
    phone: '+923458765432',
    cnic: '42301-8899001-3',
    shift: 'General Full Day',
    status: 'Active',
    joiningDate: '01/Nov/2022',
    managerDetails: {
      isKeyholder: true,
      maxDiscountAuth: 4000,
      directReporteesCount: 26,
      emergencyContact: '+923004455667',
    },
  },
  {
    id: 'MOD-CLF-01',
    name: 'Zubair Shah',
    avatar: 'assets/images/users/avatar-9.jpg',
    role: 'Moderator',
    branchId: 'CLF-01',
    branchName: 'Rainbow Superstore - Clifton',
    branchCode: 'CLF-01',
    city: 'Karachi',
    email: 'zubair.s@rainbowcc.com.pk',
    phone: '+923129988776',
    cnic: '42301-4433221-5',
    shift: 'Evening (04:00 PM - 12:00 AM)',
    status: 'Active',
    joiningDate: '15/Sep/2023',
    moderatorDetails: {
      canApproveReturns: true,
      canModerateFeedback: true,
      canOverridePrices: false,
      canCancelOrders: true,
      dailyApprovalsCount: 42,
    },
  },
  {
    id: 'RDR-CLF-101',
    name: 'Danish Khan',
    avatar: 'assets/images/users/avatar-10.jpg',
    role: 'Rider',
    branchId: 'CLF-01',
    branchName: 'Rainbow Superstore - Clifton',
    branchCode: 'CLF-01',
    city: 'Karachi',
    email: 'danish.rider@rainbowcc.com.pk',
    phone: '+923348877665',
    cnic: '42301-1199887-9',
    shift: 'Morning (08:00 AM - 04:00 PM)',
    status: 'On Delivery',
    joiningDate: '05/Jan/2024',
    riderDetails: {
      vehicleType: 'Motorbike',
      vehicleRegNo: 'KHI-2023-9901',
      licenseNo: 'DL-KHI-44312',
      appAccessPin: '7721',
      totalDeliveries: 1540,
      rating: 4.9,
      currentOrderId: '32440150',
      maxCashLimit: 60000,
    },
  },
  {
    id: 'DSP-CLF-01',
    name: 'Sohail Abbasi',
    avatar: 'assets/images/users/avatar-7.jpg',
    role: 'Dispatcher',
    branchId: 'CLF-01',
    branchName: 'Rainbow Superstore - Clifton',
    branchCode: 'CLF-01',
    city: 'Karachi',
    email: 'sohail.dispatcher@rainbowcc.com.pk',
    phone: '+923331122334',
    cnic: '42201-9988771-3',
    shift: 'Morning (08:00 AM - 04:00 PM)',
    status: 'Active',
    joiningDate: '10/Feb/2024',
    dispatcherDetails: {
      stagingBay: 'Staging Bay 1',
      assignedStoreBranch: 'Rainbow Superstore - Clifton',
      readyOrdersCount: 16,
      appPin: '6619'
    }
  },
  {
    id: 'DSP-SKP-01',
    name: 'Zubair Khan',
    avatar: 'assets/images/users/avatar-8.jpg',
    role: 'Dispatcher',
    branchId: 'SKP-01',
    branchName: 'Rainbow Cash & Carry - Sheikhupura',
    branchCode: 'SKP-01',
    city: 'Sheikhupura',
    email: 'zubair.dispatcher@rainbowcc.com.pk',
    phone: '+923008887711',
    cnic: '35404-9871234-7',
    shift: 'Morning (08:00 AM - 04:00 PM)',
    status: 'Active',
    joiningDate: '10/Feb/2024',
    dispatcherDetails: {
      stagingBay: 'Staging Bay 1',
      assignedStoreBranch: 'Rainbow Cash & Carry - Sheikhupura',
      readyOrdersCount: 8,
      appPin: '3391'
    }
  },

  // --- GULSHAN BRANCH ---
  {
    id: 'MGR-GSH-01',
    name: 'Imran Siddiqui',
    avatar: 'assets/images/users/avatar-11.jpg',
    role: 'Branch Manager',
    branchId: 'GSH-01',
    branchName: 'Rainbow Superstore - Gulshan',
    branchCode: 'GSH-01',
    city: 'Karachi',
    email: 'imran.gulshan@rainbowcc.com.pk',
    phone: '+923126789012',
    cnic: '42101-3344556-7',
    shift: 'General Full Day',
    status: 'Active',
    joiningDate: '01/Jan/2022',
    managerDetails: {
      isKeyholder: true,
      maxDiscountAuth: 5000,
      directReporteesCount: 30,
      emergencyContact: '+923331122334',
    },
  },
  {
    id: 'MOD-GSH-01',
    name: 'Sara Farooq',
    avatar: 'assets/images/users/avatar-12.jpg',
    role: 'Moderator',
    branchId: 'GSH-01',
    branchName: 'Rainbow Superstore - Gulshan',
    branchCode: 'GSH-01',
    city: 'Karachi',
    email: 'sara.f@rainbowcc.com.pk',
    phone: '+923008877665',
    cnic: '42101-9988776-4',
    shift: 'Morning (08:00 AM - 04:00 PM)',
    status: 'Active',
    joiningDate: '10/Feb/2024',
    moderatorDetails: {
      canApproveReturns: true,
      canModerateFeedback: true,
      canOverridePrices: true,
      canCancelOrders: true,
      dailyApprovalsCount: 38,
    },
  },
  {
    id: 'RDR-GSH-101',
    name: 'Bilal Ahmed',
    avatar: 'assets/images/users/avatar-1.jpg',
    role: 'Rider',
    branchId: 'GSH-01',
    branchName: 'Rainbow Superstore - Gulshan',
    branchCode: 'GSH-01',
    city: 'Karachi',
    email: 'bilal.gsh@rainbowcc.com.pk',
    phone: '+923134455667',
    cnic: '42101-5566778-9',
    shift: 'Morning (08:00 AM - 04:00 PM)',
    status: 'Active',
    joiningDate: '01/Mar/2024',
    riderDetails: {
      vehicleType: 'Electric Scooter',
      vehicleRegNo: 'KHI-2024-5582',
      licenseNo: 'DL-KHI-88910',
      appAccessPin: '5591',
      totalDeliveries: 780,
      rating: 4.8,
      maxCashLimit: 40000,
    },
  },
  {
    id: 'RDR-GSH-102',
    name: 'Shahbaz Qureshi',
    avatar: 'assets/images/users/avatar-2.jpg',
    role: 'Rider',
    branchId: 'GSH-01',
    branchName: 'Rainbow Superstore - Gulshan',
    branchCode: 'GSH-01',
    city: 'Karachi',
    email: 'shahbaz.q@rainbowcc.com.pk',
    phone: '+923459988112',
    cnic: '42101-1122998-3',
    shift: 'Evening (04:00 PM - 12:00 AM)',
    status: 'Off Duty',
    joiningDate: '15/May/2024',
    riderDetails: {
      vehicleType: 'Motorbike',
      vehicleRegNo: 'KHI-2023-1129',
      licenseNo: 'DL-KHI-33219',
      appAccessPin: '8821',
      totalDeliveries: 450,
      rating: 4.6,
      maxCashLimit: 50000,
    },
  },

  // --- DHA PHASE 6 BRANCH ---
  {
    id: 'MGR-DHA-01',
    name: 'Kashif Memon',
    avatar: 'assets/images/users/avatar-3.jpg',
    role: 'Branch Manager',
    branchId: 'DHA-06',
    branchName: 'Rainbow Superstore - DHA Phase 6',
    branchCode: 'DHA-06',
    city: 'Karachi',
    email: 'kashif.dha@rainbowcc.com.pk',
    phone: '+923019876543',
    cnic: '42301-7766554-1',
    shift: 'General Full Day',
    status: 'Active',
    joiningDate: '01/Jun/2022',
    managerDetails: {
      isKeyholder: true,
      maxDiscountAuth: 4000,
      directReporteesCount: 20,
      emergencyContact: '+923214433221',
    },
  },
  {
    id: 'RDR-DHA-101',
    name: 'Adnan Tariq',
    avatar: 'assets/images/users/avatar-4.jpg',
    role: 'Rider',
    branchId: 'DHA-06',
    branchName: 'Rainbow Superstore - DHA Phase 6',
    branchCode: 'DHA-06',
    city: 'Karachi',
    email: 'adnan.rider@rainbowcc.com.pk',
    phone: '+923023344556',
    cnic: '42301-3322119-7',
    shift: 'Morning (08:00 AM - 04:00 PM)',
    status: 'Active',
    joiningDate: '01/Apr/2024',
    riderDetails: {
      vehicleType: 'Motorbike',
      vehicleRegNo: 'KHI-2024-7741',
      licenseNo: 'DL-KHI-77291',
      appAccessPin: '9921',
      totalDeliveries: 920,
      rating: 4.9,
      maxCashLimit: 50000,
    },
  },
];

// Compatibility export
export const RoleData = RAINBOW_STAFF_MEMBERS;
