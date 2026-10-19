export interface TimingScheduleBlock {
  id: string;
  days: { [day: string]: boolean };
  firstHalfOpen: string;
  firstHalfClose: string;
  secondHalfOpen: string;
  secondHalfClose: string;
}

export interface BranchConfiguration {
  id: string; // e.g. 'VAL-01' or 'WAP-01'
  name: string; // e.g. 'Rainbow Cash & Carry - Wapda Town'
  code: string; // e.g. 'WAP-01'
  city: 'Lahore' | 'Karachi' | 'Sheikhupura';
  tradeArea: string; // e.g. 'Wapda Town'
  managerName: string;
  status: 'Open' | 'Busy (Rush Hour)' | 'Temporarily Closed';

  // Step 1: Address & Geolocation
  address: {
    searchLocation: string;
    latitude: number;
    longitude: number;
    buildingName: string; // House# / Building
    street: string;
    area: string;
    postalCode: string;
    deliveryRadiusKm: number;
    landmarkNotes?: string;
  };

  // Step 2: Branch Operational & Delivery Settings
  settings: {
    // Delivery
    asapOnly: boolean;
    preOrderOnly: boolean;
    minPreOrderHours: number;
    maxPreOrderHours: number;
    multipleSlabs: boolean;
    applyToAllBranches: boolean;
    waiveOffLimit: number;
    standardDeliveryFee: number;
    rushHourEtaAdjustmentMins: number;

    // Store & Other
    fbrPosCharges: boolean;
    blinkDeliveryModule: boolean;
    taxPercentage: number;
    onlineTaxPercentage: number;
    inclusiveTaxPercentage: number;
    inclusiveOnlineTaxPercentage: number;
    deliveryChargesTax: boolean;
    toggledItemsReEnableHours: string; // 'Never' | '1' | '2' | '4' | '12' | '24'
    pickupPrepTimeMins: number;
    maxOrdersPerHourCapacity: number;

    // Customer Support
    contactEmail: string;
    contactNumber: string;
    whatsappActive: boolean;

    // Third party
    mappingBranchId: number | string;
    posSyncStatus: string;

    // Payment methods accepted
    acceptsCod: boolean;
    acceptsCaod: boolean;
    acceptsWallet: boolean;
    acceptsOnlineCard: boolean;
  };

  // Step 3: Timings
  timing: {
    separateTimings: boolean;
    schedules: TimingScheduleBlock[];
    ramadanOverrideActive: boolean;
    holidayClosedActive: boolean;
    lastOrderCutoffMins: number;
  };

  // Live Metrics
  todayOrders: number;
  activeCouriers: number;
}

export const RAINBOW_ALL_BRANCHES: BranchConfiguration[] = [
  {
    id: 'WAP-01',
    name: 'Rainbow Cash & Carry - Wapda Town',
    code: 'WAP-01',
    city: 'Lahore',
    tradeArea: 'Wapda Town',
    managerName: 'Zeeshan Malik',
    status: 'Open',
    address: {
      searchLocation: 'Wapda Town, Lahore, Punjab, Pakistan',
      latitude: 31.419919499059,
      longitude: 74.2658053087,
      buildingName: 'Rainbow Cash & Carry - Wapda Town',
      street: 'K-1 Block K 1 Phase 1',
      area: 'Wapda Town',
      postalCode: '54770',
      deliveryRadiusKm: 10,
      landmarkNotes: 'Near Rehmat Market and Valencia Main Boulevard junction',
    },
    settings: {
      asapOnly: false,
      preOrderOnly: false,
      minPreOrderHours: 4,
      maxPreOrderHours: 48,
      multipleSlabs: false,
      applyToAllBranches: false,
      waiveOffLimit: 3500,
      standardDeliveryFee: 250,
      rushHourEtaAdjustmentMins: 30,
      fbrPosCharges: true,
      blinkDeliveryModule: true,
      taxPercentage: 0,
      onlineTaxPercentage: 0,
      inclusiveTaxPercentage: 0,
      inclusiveOnlineTaxPercentage: 0,
      deliveryChargesTax: false,
      toggledItemsReEnableHours: 'Never',
      pickupPrepTimeMins: 20,
      maxOrdersPerHourCapacity: 60,
      contactEmail: 'online@rainbowcc.com.pk',
      contactNumber: '+923107779652',
      whatsappActive: true,
      mappingBranchId: 3,
      posSyncStatus: 'Connected (Rainbow POS Cloud v2.4)',
      acceptsCod: true,
      acceptsCaod: true,
      acceptsWallet: true,
      acceptsOnlineCard: true,
    },
    timing: {
      separateTimings: false,
      ramadanOverrideActive: false,
      holidayClosedActive: false,
      lastOrderCutoffMins: 30,
      schedules: [
        {
          id: 'sched-wap-1',
          days: { Sunday: true, Monday: true, Tuesday: true, Wednesday: true, Thursday: true, Friday: false, Saturday: true },
          firstHalfOpen: '09:00 AM',
          firstHalfClose: '06:00 PM',
          secondHalfOpen: '06:00 PM',
          secondHalfClose: '10:30 PM',
        },
        {
          id: 'sched-wap-2',
          days: { Sunday: false, Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: true, Saturday: false },
          firstHalfOpen: '09:00 AM',
          firstHalfClose: '12:00 PM',
          secondHalfOpen: '02:00 PM',
          secondHalfClose: '10:30 PM',
        },
      ],
    },
    todayOrders: 142,
    activeCouriers: 8,
  },
  {
    id: 'VAL-01',
    name: 'Rainbow Cash & Carry - Valencia',
    code: 'VAL-01',
    city: 'Lahore',
    tradeArea: 'Valencia Town',
    managerName: 'Muhammad Salman',
    status: 'Open',
    address: {
      searchLocation: 'Valencia Town, Lahore, Punjab, Pakistan',
      latitude: 31.4012,
      longitude: 74.2534,
      buildingName: 'Rainbow Superstore - Valencia',
      street: 'Commercial Block D, Valencia Town Main Boulevard',
      area: 'Valencia Town',
      postalCode: '54770',
      deliveryRadiusKm: 12,
      landmarkNotes: 'Main Valencia commercial entrance',
    },
    settings: {
      asapOnly: false,
      preOrderOnly: false,
      minPreOrderHours: 4,
      maxPreOrderHours: 48,
      multipleSlabs: false,
      applyToAllBranches: false,
      waiveOffLimit: 3500,
      standardDeliveryFee: 250,
      rushHourEtaAdjustmentMins: 20,
      fbrPosCharges: true,
      blinkDeliveryModule: true,
      taxPercentage: 0,
      onlineTaxPercentage: 0,
      inclusiveTaxPercentage: 0,
      inclusiveOnlineTaxPercentage: 0,
      deliveryChargesTax: false,
      toggledItemsReEnableHours: '2',
      pickupPrepTimeMins: 15,
      maxOrdersPerHourCapacity: 75,
      contactEmail: 'valencia@rainbowcc.com.pk',
      contactNumber: '+923214567891',
      whatsappActive: true,
      mappingBranchId: 1,
      posSyncStatus: 'Connected (Rainbow POS Cloud v2.4)',
      acceptsCod: true,
      acceptsCaod: true,
      acceptsWallet: true,
      acceptsOnlineCard: true,
    },
    timing: {
      separateTimings: false,
      ramadanOverrideActive: false,
      holidayClosedActive: false,
      lastOrderCutoffMins: 30,
      schedules: [
        {
          id: 'sched-val-1',
          days: { Sunday: true, Monday: true, Tuesday: true, Wednesday: true, Thursday: true, Friday: false, Saturday: true },
          firstHalfOpen: '09:00 AM',
          firstHalfClose: '06:00 PM',
          secondHalfOpen: '06:00 PM',
          secondHalfClose: '11:00 PM',
        },
        {
          id: 'sched-val-2',
          days: { Sunday: false, Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: true, Saturday: false },
          firstHalfOpen: '09:00 AM',
          firstHalfClose: '12:30 PM',
          secondHalfOpen: '02:30 PM',
          secondHalfClose: '11:00 PM',
        },
      ],
    },
    todayOrders: 186,
    activeCouriers: 12,
  },
  {
    id: 'CLF-01',
    name: 'Rainbow Superstore - Clifton (Ocean Mall)',
    code: 'CLF-01',
    city: 'Karachi',
    tradeArea: 'Clifton',
    managerName: 'Farhan Qasim',
    status: 'Open',
    address: {
      searchLocation: 'Clifton Block 2, Karachi, Sindh, Pakistan',
      latitude: 24.8138,
      longitude: 67.0300,
      buildingName: 'Rainbow Superstore - Clifton',
      street: 'Near Ocean Mall, Block 2, Clifton',
      area: 'Clifton',
      postalCode: '75600',
      deliveryRadiusKm: 8,
      landmarkNotes: 'Near Ocean Mall Basement Parking Gate 2',
    },
    settings: {
      asapOnly: false,
      preOrderOnly: false,
      minPreOrderHours: 3,
      maxPreOrderHours: 48,
      multipleSlabs: true,
      applyToAllBranches: false,
      waiveOffLimit: 4000,
      standardDeliveryFee: 300,
      rushHourEtaAdjustmentMins: 35,
      fbrPosCharges: true,
      blinkDeliveryModule: true,
      taxPercentage: 0,
      onlineTaxPercentage: 0,
      inclusiveTaxPercentage: 0,
      inclusiveOnlineTaxPercentage: 0,
      deliveryChargesTax: false,
      toggledItemsReEnableHours: '1',
      pickupPrepTimeMins: 25,
      maxOrdersPerHourCapacity: 90,
      contactEmail: 'clifton@rainbowcc.com.pk',
      contactNumber: '+923458765432',
      whatsappActive: true,
      mappingBranchId: 2,
      posSyncStatus: 'Connected (Rainbow POS Cloud v2.4)',
      acceptsCod: true,
      acceptsCaod: true,
      acceptsWallet: true,
      acceptsOnlineCard: true,
    },
    timing: {
      separateTimings: true,
      ramadanOverrideActive: false,
      holidayClosedActive: false,
      lastOrderCutoffMins: 45,
      schedules: [
        {
          id: 'sched-clf-1',
          days: { Sunday: true, Monday: true, Tuesday: true, Wednesday: true, Thursday: true, Friday: false, Saturday: true },
          firstHalfOpen: '08:30 AM',
          firstHalfClose: '05:30 PM',
          secondHalfOpen: '05:30 PM',
          secondHalfClose: '11:30 PM',
        },
        {
          id: 'sched-clf-2',
          days: { Sunday: false, Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: true, Saturday: false },
          firstHalfOpen: '08:30 AM',
          firstHalfClose: '12:30 PM',
          secondHalfOpen: '02:30 PM',
          secondHalfClose: '11:30 PM',
        },
      ],
    },
    todayOrders: 230,
    activeCouriers: 15,
  },
  {
    id: 'GSH-01',
    name: 'Rainbow Superstore - Gulshan (Main Hub)',
    code: 'GSH-01',
    city: 'Karachi',
    tradeArea: 'Gulshan-e-Iqbal',
    managerName: 'Imran Siddiqui',
    status: 'Open',
    address: {
      searchLocation: 'Gulshan-e-Iqbal Block 13-D, Karachi, Sindh, Pakistan',
      latitude: 24.9207,
      longitude: 67.0935,
      buildingName: 'Rainbow Superstore - Gulshan Main Hub',
      street: 'Block 13-D-2, University Road, Gulshan-e-Iqbal',
      area: 'Gulshan-e-Iqbal',
      postalCode: '75300',
      deliveryRadiusKm: 10,
    },
    settings: {
      asapOnly: false,
      preOrderOnly: false,
      minPreOrderHours: 4,
      maxPreOrderHours: 48,
      multipleSlabs: false,
      applyToAllBranches: false,
      waiveOffLimit: 3500,
      standardDeliveryFee: 250,
      rushHourEtaAdjustmentMins: 25,
      fbrPosCharges: true,
      blinkDeliveryModule: true,
      taxPercentage: 0,
      onlineTaxPercentage: 0,
      inclusiveTaxPercentage: 0,
      inclusiveOnlineTaxPercentage: 0,
      deliveryChargesTax: false,
      toggledItemsReEnableHours: 'Never',
      pickupPrepTimeMins: 15,
      maxOrdersPerHourCapacity: 100,
      contactEmail: 'gulshan@rainbowcc.com.pk',
      contactNumber: '+923126789012',
      whatsappActive: true,
      mappingBranchId: 4,
      posSyncStatus: 'Connected (Rainbow POS Cloud v2.4)',
      acceptsCod: true,
      acceptsCaod: true,
      acceptsWallet: true,
      acceptsOnlineCard: true,
    },
    timing: {
      separateTimings: false,
      ramadanOverrideActive: false,
      holidayClosedActive: false,
      lastOrderCutoffMins: 30,
      schedules: [
        {
          id: 'sched-gsh-1',
          days: { Sunday: true, Monday: true, Tuesday: true, Wednesday: true, Thursday: true, Friday: false, Saturday: true },
          firstHalfOpen: '09:00 AM',
          firstHalfClose: '06:00 PM',
          secondHalfOpen: '06:00 PM',
          secondHalfClose: '11:00 PM',
        },
        {
          id: 'sched-gsh-2',
          days: { Sunday: false, Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: true, Saturday: false },
          firstHalfOpen: '09:00 AM',
          firstHalfClose: '12:30 PM',
          secondHalfOpen: '02:30 PM',
          secondHalfClose: '11:00 PM',
        },
      ],
    },
    todayOrders: 275,
    activeCouriers: 18,
  },
  {
    id: 'DHA-06',
    name: 'Rainbow Superstore - DHA Phase 6',
    code: 'DHA-06',
    city: 'Karachi',
    tradeArea: 'DHA Phase 6',
    managerName: 'Kashif Memon',
    status: 'Open',
    address: {
      searchLocation: 'Khayaban-e-Seher, DHA Phase 6, Karachi, Sindh, Pakistan',
      latitude: 24.7865,
      longitude: 67.0684,
      buildingName: 'Rainbow Superstore - DHA Phase 6',
      street: 'Commercial Plot 24-C, Khayaban-e-Seher',
      area: 'DHA Phase 6',
      postalCode: '75500',
      deliveryRadiusKm: 7,
    },
    settings: {
      asapOnly: false,
      preOrderOnly: false,
      minPreOrderHours: 4,
      maxPreOrderHours: 48,
      multipleSlabs: false,
      applyToAllBranches: false,
      waiveOffLimit: 3500,
      standardDeliveryFee: 250,
      rushHourEtaAdjustmentMins: 20,
      fbrPosCharges: true,
      blinkDeliveryModule: true,
      taxPercentage: 0,
      onlineTaxPercentage: 0,
      inclusiveTaxPercentage: 0,
      inclusiveOnlineTaxPercentage: 0,
      deliveryChargesTax: false,
      toggledItemsReEnableHours: 'Never',
      pickupPrepTimeMins: 20,
      maxOrdersPerHourCapacity: 70,
      contactEmail: 'dha6@rainbowcc.com.pk',
      contactNumber: '+923019876543',
      whatsappActive: true,
      mappingBranchId: 5,
      posSyncStatus: 'Connected (Rainbow POS Cloud v2.4)',
      acceptsCod: true,
      acceptsCaod: true,
      acceptsWallet: true,
      acceptsOnlineCard: true,
    },
    timing: {
      separateTimings: false,
      ramadanOverrideActive: false,
      holidayClosedActive: false,
      lastOrderCutoffMins: 30,
      schedules: [
        {
          id: 'sched-dha-1',
          days: { Sunday: true, Monday: true, Tuesday: true, Wednesday: true, Thursday: true, Friday: false, Saturday: true },
          firstHalfOpen: '09:00 AM',
          firstHalfClose: '06:00 PM',
          secondHalfOpen: '06:00 PM',
          secondHalfClose: '11:00 PM',
        },
        {
          id: 'sched-dha-2',
          days: { Sunday: false, Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: true, Saturday: false },
          firstHalfOpen: '09:00 AM',
          firstHalfClose: '12:30 PM',
          secondHalfOpen: '02:30 PM',
          secondHalfClose: '11:00 PM',
        },
      ],
    },
    todayOrders: 168,
    activeCouriers: 10,
  },
  {
    id: 'BHR-01',
    name: 'Rainbow Superstore - Bahria Town',
    code: 'BHR-01',
    city: 'Karachi',
    tradeArea: 'Bahria Town',
    managerName: 'Asadullah Khan',
    status: 'Open',
    address: {
      searchLocation: 'Midway Commercial, Bahria Town, Karachi, Sindh, Pakistan',
      latitude: 24.9982,
      longitude: 67.3129,
      buildingName: 'Rainbow Superstore - Bahria Town',
      street: 'Plot 88, Midway Commercial B, Precinct 4',
      area: 'Bahria Town',
      postalCode: '75340',
      deliveryRadiusKm: 15,
    },
    settings: {
      asapOnly: false,
      preOrderOnly: false,
      minPreOrderHours: 4,
      maxPreOrderHours: 48,
      multipleSlabs: false,
      applyToAllBranches: false,
      waiveOffLimit: 4000,
      standardDeliveryFee: 300,
      rushHourEtaAdjustmentMins: 30,
      fbrPosCharges: true,
      blinkDeliveryModule: true,
      taxPercentage: 0,
      onlineTaxPercentage: 0,
      inclusiveTaxPercentage: 0,
      inclusiveOnlineTaxPercentage: 0,
      deliveryChargesTax: false,
      toggledItemsReEnableHours: 'Never',
      pickupPrepTimeMins: 25,
      maxOrdersPerHourCapacity: 65,
      contactEmail: 'bahria@rainbowcc.com.pk',
      contactNumber: '+923345123998',
      whatsappActive: true,
      mappingBranchId: 6,
      posSyncStatus: 'Connected (Rainbow POS Cloud v2.4)',
      acceptsCod: true,
      acceptsCaod: true,
      acceptsWallet: true,
      acceptsOnlineCard: true,
    },
    timing: {
      separateTimings: false,
      ramadanOverrideActive: false,
      holidayClosedActive: false,
      lastOrderCutoffMins: 30,
      schedules: [
        {
          id: 'sched-bhr-1',
          days: { Sunday: true, Monday: true, Tuesday: true, Wednesday: true, Thursday: true, Friday: false, Saturday: true },
          firstHalfOpen: '09:00 AM',
          firstHalfClose: '06:00 PM',
          secondHalfOpen: '06:00 PM',
          secondHalfClose: '11:00 PM',
        },
        {
          id: 'sched-bhr-2',
          days: { Sunday: false, Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: true, Saturday: false },
          firstHalfOpen: '09:00 AM',
          firstHalfClose: '12:30 PM',
          secondHalfOpen: '02:30 PM',
          secondHalfClose: '11:00 PM',
        },
      ],
    },
    todayOrders: 115,
    activeCouriers: 7,
  },
];
