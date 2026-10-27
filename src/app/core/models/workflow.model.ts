export type OrderLifecycleStatus =
  | 'Placed'
  | 'Confirmed'
  | 'Picking'
  | 'Packed'
  | 'Rider assigned'
  | 'Out for delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded'
  // Preserved legacy statuses for backward compatibility
  | 'Pending'
  | 'Accepted'
  | 'Dispatch'
  | 'Rejected';

export type OrderUrgency = 'Urgent' | 'Standard' | 'Scheduled';

export type PriorityTier = 'P1' | 'P2' | 'P3' | 'P4';

export interface PriorityScoringFactors {
  timeToSlot: number;
  orderType: number;
  perishable: number;
  customerTier: number;
  ageInQueue: number;
  orderValue: number;
}

export interface OrderPriorityDetails {
  urgency: OrderUrgency;
  targetPickMinutes: number;
  deadlineTimestamp: string;
  isOverridden?: boolean;
  overriddenUrgency?: OrderUrgency;
  overrideReason?: string;
  overriddenBy?: string;
  overriddenAt?: string;
  // Backward compatibility
  score?: number;
  tier?: PriorityTier;
  overriddenTier?: PriorityTier;
  factors?: PriorityScoringFactors;
}

export type ExceptionType =
  | 'payment_pending_timeout'
  | 'item_out_of_stock'
  | 'store_timeout'
  | 'no_rider_accepted'
  | 'fraud_hold'
  | 'capacity_breach'
  | 'eta_slip';

export interface OrderException {
  id: string;
  type: ExceptionType;
  title: string;
  details: string;
  severity: 'critical' | 'high' | 'medium';
  flaggedAt: string;
  status: 'Pending Review' | 'Resolved' | 'Escalated';
  resolutionAction?: string;
  resolutionNote?: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

export type TimeLogEventType =
  | 'shift_start'
  | 'shift_end'
  | 'break_start'
  | 'break_end'
  | 'order_created'
  | 'validated'
  | 'scored'
  | 'queued'
  | 'review_started'
  | 'review_resolved'
  | 'pick_started'
  | 'pick_completed'
  | 'ready_marked'
  | 'offer_sent'
  | 'offer_accepted'
  | 'offer_declined'
  | 'arrived_store'
  | 'picked_up'
  | 'arrived_customer'
  | 'delivered'
  | 'job_closed';

export interface TimeLogRecord {
  id: string;
  orderId?: string;
  orderCode?: string;
  staffId?: string;
  staffName?: string;
  riderId?: string;
  riderName?: string;
  branchCode: string;
  branchName: string;
  eventType: TimeLogEventType;
  timestamp: string; // ISO format or formatted
  source: 'automatic' | 'manual';
  gpsLocation?: { lat: number; lng: number };
  notes?: string;
  isCorrected?: boolean;
  originalTimestamp?: string;
  correctedBy?: string;
  correctionReason?: string;
  correctedAt?: string;
}

export interface StoreCapacity {
  branchCode: string;
  branchName: string;
  maxCapacityOrders: number;
  activeOrders: number;
  utilizationRate: number; // 0 - 100
  status: 'Optimal' | 'High Load' | 'Overload' | 'Paused';
  isPaused: boolean;
  pausedReason?: string;
}

export interface RainbowBranch {
  id: string; // e.g. 'VAL-01'
  branchCode: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  deliveryRadiusKm: number;
  operatingHours: string;
  maxCapacityOrders: number;
  activeOrders: number;
  utilizationRate: number;
  pickersOnDuty: number;
  ridersAvailable: number;
  status: 'Active' | 'Paused' | 'Inactive';
  autoRerouteThreshold: number; // e.g. 80 (%)
  instantDeliveryEnabled: boolean;
  codMaxLimit: number; // in PKR
}

export interface BranchAutomationRule {
  branchCode: string;
  branchName: string;
  city: string;
  // Dispatcher Queue Thresholds & Automation
  dispatcherMaxOrdersThreshold: number; // e.g. 10 orders per dispatcher
  autoAssignDispatcherOnAccept: boolean; // Auto queue to dispatcher on Moderator acceptance
  priorityDispatcherRouting: boolean; // Priority orders placed at front of dispatcher queue

  // Rider Queue Thresholds & Automation
  riderMaxOrdersThreshold: number; // e.g. 3 orders per rider concurrently
  autoAssignRiderOnReadyToPick: boolean; // Auto queue to rider when Dispatcher marks Ready for Pickup
  priorityRiderRouting: boolean; // Fast-track priority orders to available riders

  // Refund approval limits
  bmRefundLimitPkr: number; // e.g. 1500
  modRefundLimitPkr: number; // e.g. 5000

  // Optional legacy fields for backward compatibility
  maxCapacityOrders?: number;
  autoPauseAtMax?: boolean;
  autoRerouteEnabled?: boolean;
  rerouteThresholdPercent?: number;
  urgentPickTargetMins?: number;
  standardPickTargetMins?: number;
  scheduledReleaseLeadMins?: number;
  autoRiderDispatch?: boolean;
  noRiderEscalationMins?: number;
  urgentUnpickedAlertMins?: number;
  standardUnpickedAlertMins?: number;
  delayedDeliveryAlertMins?: number;
}

export interface AutomationThresholdConfig {
  weights: {
    timeToSlot: number;
    orderType: number;
    perishable: number;
    customerTier: number;
    ageInQueue: number;
    orderValue: number;
  };
  tiers: {
    p1Min: number;
    p2Min: number;
    p3Min: number;
  };
  targets: {
    p1PickTargetMins: number;
    p2PickTargetMins: number;
    p3PickTargetMins: number;
    p4ReleaseLeadMins: number;
  };
  storeLoadThresholds: {
    warningPercent: number;
    reroutePercent: number;
    pausePercent: number;
  };
  escalationTimers: {
    unpickedP1P2Mins: number;
    unpickedP3Mins: number;
    readyWithoutRiderMins: number;
    etaSlipMins: number;
    paymentTimeoutMins: number;
    substitutionTimeoutMins: number;
  };
  approvalLimits: {
    branchManagerMaxRefundPkr: number;
    moderatorMaxRefundPkr: number;
    adminUnlimited: boolean;
  };
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  branchCode: string;
  action: string;
  entityType: 'Order' | 'Priority' | 'Rider' | 'Branch' | 'Threshold' | 'TimeLog' | 'Refund' | 'User';
  entityId: string;
  timestamp: string;
  oldValue?: string;
  newValue?: string;
  reason?: string;
  details?: string;
}
