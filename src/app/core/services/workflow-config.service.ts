import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  AutomationThresholdConfig,
  OrderLifecycleStatus,
  OrderPriorityDetails,
  PriorityScoringFactors,
  PriorityTier,
  StoreCapacity,
  RainbowBranch,
  BranchAutomationRule,
  OrderUrgency
} from '@core/models/workflow.model';
import { AuditService } from './audit.service';

@Injectable({
  providedIn: 'root'
})
export class WorkflowConfigService {
  private auditService = inject(AuditService);

  private readonly CONFIG_KEY = '_RAINBOW_WORKFLOW_CONFIG_';
  private readonly CAPACITIES_KEY = '_RAINBOW_STORE_CAPACITIES_';
  private readonly BRANCHES_KEY = '_RAINBOW_BRANCHES_LIST_';
  private readonly BRANCH_RULES_KEY = '_RAINBOW_BRANCH_RULES_LIST_';

  private defaultBranchRule(branchCode: string, branchName: string, city: string, maxCap: number): BranchAutomationRule {
    return {
      branchCode,
      branchName,
      city,
      dispatcherMaxOrdersThreshold: 10,
      autoAssignDispatcherOnAccept: true,
      priorityDispatcherRouting: true,
      riderMaxOrdersThreshold: 3,
      autoAssignRiderOnReadyToPick: true,
      priorityRiderRouting: true,
      maxCapacityOrders: maxCap,
      autoPauseAtMax: true,
      autoRerouteEnabled: true,
      rerouteThresholdPercent: 80,
      urgentPickTargetMins: 10,
      standardPickTargetMins: 20,
      scheduledReleaseLeadMins: 45,
      autoRiderDispatch: true,
      noRiderEscalationMins: 3,
      urgentUnpickedAlertMins: 5,
      standardUnpickedAlertMins: 15,
      delayedDeliveryAlertMins: 10,
      bmRefundLimitPkr: 1500,
      modRefundLimitPkr: 5000
    };
  }

  private initialBranchRules: BranchAutomationRule[] = [
    { branchCode: 'VAL-01', branchName: 'Rainbow Cash & Carry - Valencia', city: 'Lahore', dispatcherMaxOrdersThreshold: 10, autoAssignDispatcherOnAccept: true, priorityDispatcherRouting: true, riderMaxOrdersThreshold: 3, autoAssignRiderOnReadyToPick: true, priorityRiderRouting: true, maxCapacityOrders: 60, autoPauseAtMax: true, autoRerouteEnabled: true, rerouteThresholdPercent: 80, urgentPickTargetMins: 10, standardPickTargetMins: 20, scheduledReleaseLeadMins: 45, autoRiderDispatch: true, noRiderEscalationMins: 3, urgentUnpickedAlertMins: 5, standardUnpickedAlertMins: 15, delayedDeliveryAlertMins: 10, bmRefundLimitPkr: 1500, modRefundLimitPkr: 5000 },
    { branchCode: 'SKP-01', branchName: 'Rainbow Cash & Carry - Sheikhupura', city: 'Sheikhupura', dispatcherMaxOrdersThreshold: 10, autoAssignDispatcherOnAccept: true, priorityDispatcherRouting: true, riderMaxOrdersThreshold: 3, autoAssignRiderOnReadyToPick: true, priorityRiderRouting: true, maxCapacityOrders: 40, autoPauseAtMax: true, autoRerouteEnabled: true, rerouteThresholdPercent: 80, urgentPickTargetMins: 10, standardPickTargetMins: 20, scheduledReleaseLeadMins: 45, autoRiderDispatch: true, noRiderEscalationMins: 3, urgentUnpickedAlertMins: 5, standardUnpickedAlertMins: 15, delayedDeliveryAlertMins: 10, bmRefundLimitPkr: 1500, modRefundLimitPkr: 5000 },
    { branchCode: 'CNR-01', branchName: 'Rainbow Cash & Carry - Canal Road', city: 'Lahore', dispatcherMaxOrdersThreshold: 10, autoAssignDispatcherOnAccept: true, priorityDispatcherRouting: true, riderMaxOrdersThreshold: 3, autoAssignRiderOnReadyToPick: true, priorityRiderRouting: true, maxCapacityOrders: 50, autoPauseAtMax: true, autoRerouteEnabled: true, rerouteThresholdPercent: 80, urgentPickTargetMins: 10, standardPickTargetMins: 20, scheduledReleaseLeadMins: 45, autoRiderDispatch: true, noRiderEscalationMins: 3, urgentUnpickedAlertMins: 5, standardUnpickedAlertMins: 15, delayedDeliveryAlertMins: 10, bmRefundLimitPkr: 1500, modRefundLimitPkr: 5000 },
    { branchCode: 'CLF-01', branchName: 'Rainbow Superstore - Clifton', city: 'Karachi', dispatcherMaxOrdersThreshold: 12, autoAssignDispatcherOnAccept: true, priorityDispatcherRouting: true, riderMaxOrdersThreshold: 4, autoAssignRiderOnReadyToPick: true, priorityRiderRouting: true, maxCapacityOrders: 70, autoPauseAtMax: true, autoRerouteEnabled: true, rerouteThresholdPercent: 85, urgentPickTargetMins: 8, standardPickTargetMins: 18, scheduledReleaseLeadMins: 45, autoRiderDispatch: true, noRiderEscalationMins: 3, urgentUnpickedAlertMins: 5, standardUnpickedAlertMins: 12, delayedDeliveryAlertMins: 10, bmRefundLimitPkr: 1500, modRefundLimitPkr: 5000 },
    { branchCode: 'GSH-01', branchName: 'Rainbow Superstore - Gulshan', city: 'Karachi', dispatcherMaxOrdersThreshold: 12, autoAssignDispatcherOnAccept: true, priorityDispatcherRouting: true, riderMaxOrdersThreshold: 4, autoAssignRiderOnReadyToPick: true, priorityRiderRouting: true, maxCapacityOrders: 80, autoPauseAtMax: true, autoRerouteEnabled: true, rerouteThresholdPercent: 80, urgentPickTargetMins: 10, standardPickTargetMins: 20, scheduledReleaseLeadMins: 45, autoRiderDispatch: true, noRiderEscalationMins: 3, urgentUnpickedAlertMins: 5, standardUnpickedAlertMins: 15, delayedDeliveryAlertMins: 10, bmRefundLimitPkr: 1500, modRefundLimitPkr: 5000 },
    { branchCode: 'NNZ-01', branchName: 'Rainbow Superstore - North Nazimabad', city: 'Karachi', dispatcherMaxOrdersThreshold: 10, autoAssignDispatcherOnAccept: true, priorityDispatcherRouting: true, riderMaxOrdersThreshold: 3, autoAssignRiderOnReadyToPick: true, priorityRiderRouting: true, maxCapacityOrders: 55, autoPauseAtMax: true, autoRerouteEnabled: true, rerouteThresholdPercent: 80, urgentPickTargetMins: 10, standardPickTargetMins: 20, scheduledReleaseLeadMins: 45, autoRiderDispatch: true, noRiderEscalationMins: 3, urgentUnpickedAlertMins: 5, standardUnpickedAlertMins: 15, delayedDeliveryAlertMins: 10, bmRefundLimitPkr: 1500, modRefundLimitPkr: 5000 },
    { branchCode: 'DHA-06', branchName: 'Rainbow Superstore - DHA Phase 6', city: 'Karachi', dispatcherMaxOrdersThreshold: 10, autoAssignDispatcherOnAccept: true, priorityDispatcherRouting: true, riderMaxOrdersThreshold: 3, autoAssignRiderOnReadyToPick: true, priorityRiderRouting: true, maxCapacityOrders: 50, autoPauseAtMax: true, autoRerouteEnabled: true, rerouteThresholdPercent: 80, urgentPickTargetMins: 10, standardPickTargetMins: 20, scheduledReleaseLeadMins: 45, autoRiderDispatch: true, noRiderEscalationMins: 3, urgentUnpickedAlertMins: 5, standardUnpickedAlertMins: 15, delayedDeliveryAlertMins: 10, bmRefundLimitPkr: 2000, modRefundLimitPkr: 7000 },
    { branchCode: 'BHR-01', branchName: 'Rainbow Superstore - Bahria Town', city: 'Karachi', dispatcherMaxOrdersThreshold: 8, autoAssignDispatcherOnAccept: true, priorityDispatcherRouting: true, riderMaxOrdersThreshold: 3, autoAssignRiderOnReadyToPick: true, priorityRiderRouting: true, maxCapacityOrders: 45, autoPauseAtMax: true, autoRerouteEnabled: true, rerouteThresholdPercent: 80, urgentPickTargetMins: 10, standardPickTargetMins: 20, scheduledReleaseLeadMins: 45, autoRiderDispatch: true, noRiderEscalationMins: 3, urgentUnpickedAlertMins: 5, standardUnpickedAlertMins: 15, delayedDeliveryAlertMins: 10, bmRefundLimitPkr: 1500, modRefundLimitPkr: 5000 },
    { branchCode: 'FBA-01', branchName: 'Rainbow Superstore - FB Area', city: 'Karachi', dispatcherMaxOrdersThreshold: 8, autoAssignDispatcherOnAccept: true, priorityDispatcherRouting: true, riderMaxOrdersThreshold: 3, autoAssignRiderOnReadyToPick: true, priorityRiderRouting: true, maxCapacityOrders: 40, autoPauseAtMax: true, autoRerouteEnabled: true, rerouteThresholdPercent: 80, urgentPickTargetMins: 10, standardPickTargetMins: 20, scheduledReleaseLeadMins: 45, autoRiderDispatch: true, noRiderEscalationMins: 3, urgentUnpickedAlertMins: 5, standardUnpickedAlertMins: 15, delayedDeliveryAlertMins: 10, bmRefundLimitPkr: 1500, modRefundLimitPkr: 5000 },
    { branchCode: 'HYD-01', branchName: 'Rainbow Superstore - Hyderi', city: 'Karachi', dispatcherMaxOrdersThreshold: 8, autoAssignDispatcherOnAccept: true, priorityDispatcherRouting: true, riderMaxOrdersThreshold: 3, autoAssignRiderOnReadyToPick: true, priorityRiderRouting: true, maxCapacityOrders: 35, autoPauseAtMax: true, autoRerouteEnabled: true, rerouteThresholdPercent: 80, urgentPickTargetMins: 10, standardPickTargetMins: 20, scheduledReleaseLeadMins: 45, autoRiderDispatch: true, noRiderEscalationMins: 3, urgentUnpickedAlertMins: 5, standardUnpickedAlertMins: 15, delayedDeliveryAlertMins: 10, bmRefundLimitPkr: 1500, modRefundLimitPkr: 5000 },
  ];

  // Default configuration per business specification
  private defaultConfig: AutomationThresholdConfig = {
    weights: {
      timeToSlot: 35,     // Under 20 min promised delivery slot
      orderType: 20,      // ASAP orders vs Scheduled
      perishable: 15,     // Contains fresh meat, fruits, frozen foods
      customerTier: 10,   // Premium loyalty tier
      ageInQueue: 10,     // Waiting time in queue
      orderValue: 10      // High-value order basket (> Rs. 5,000)
    },
    tiers: {
      p1Min: 80,
      p2Min: 60,
      p3Min: 30
    },
    targets: {
      p1PickTargetMins: 8,
      p2PickTargetMins: 12,
      p3PickTargetMins: 20,
      p4ReleaseLeadMins: 45
    },
    storeLoadThresholds: {
      warningPercent: 75,
      reroutePercent: 80,
      pausePercent: 100
    },
    escalationTimers: {
      unpickedP1P2Mins: 5,
      unpickedP3Mins: 10,
      readyWithoutRiderMins: 3,
      etaSlipMins: 10,
      paymentTimeoutMins: 10,
      substitutionTimeoutMins: 3
    },
    approvalLimits: {
      branchManagerMaxRefundPkr: 1500,
      moderatorMaxRefundPkr: 5000,
      adminUnlimited: true
    }
  };

  private initialBranches: RainbowBranch[] = [
    {
      id: 'VAL-01',
      branchCode: 'VAL-01',
      name: 'Rainbow Cash & Carry - Valencia',
      city: 'Lahore',
      address: 'Block K Commercial, Valencia Town',
      phone: '+924235182901',
      email: 'valencia@rainbowcc.com.pk',
      latitude: 31.4015,
      longitude: 74.2612,
      deliveryRadiusKm: 8,
      operatingHours: '08:00 AM - 11:30 PM',
      maxCapacityOrders: 60,
      activeOrders: 38,
      utilizationRate: 63,
      pickersOnDuty: 6,
      ridersAvailable: 9,
      status: 'Active',
      autoRerouteThreshold: 80,
      instantDeliveryEnabled: true,
      codMaxLimit: 50000
    },
    {
      id: 'SKP-01',
      branchCode: 'SKP-01',
      name: 'Rainbow Cash & Carry - Sheikhupura',
      city: 'Sheikhupura',
      address: 'Main Sargodha Road, Near Batti Chowk',
      phone: '+92563781200',
      email: 'sheikhupura@rainbowcc.com.pk',
      latitude: 31.7131,
      longitude: 73.9783,
      deliveryRadiusKm: 10,
      operatingHours: '08:30 AM - 11:00 PM',
      maxCapacityOrders: 40,
      activeOrders: 34,
      utilizationRate: 85,
      pickersOnDuty: 4,
      ridersAvailable: 5,
      status: 'Active',
      autoRerouteThreshold: 80,
      instantDeliveryEnabled: true,
      codMaxLimit: 40000
    },
    {
      id: 'CNR-01',
      branchCode: 'CNR-01',
      name: 'Rainbow Cash & Carry - Canal Road',
      city: 'Lahore',
      address: 'Canal Bank Road, Near Thokar Niaz Baig',
      phone: '+924235291122',
      email: 'canalroad@rainbowcc.com.pk',
      latitude: 31.4797,
      longitude: 74.2464,
      deliveryRadiusKm: 9,
      operatingHours: '08:00 AM - 12:00 AM',
      maxCapacityOrders: 50,
      activeOrders: 29,
      utilizationRate: 58,
      pickersOnDuty: 5,
      ridersAvailable: 8,
      status: 'Active',
      autoRerouteThreshold: 80,
      instantDeliveryEnabled: true,
      codMaxLimit: 60000
    },
    {
      id: 'CLF-01',
      branchCode: 'CLF-01',
      name: 'Rainbow Superstore - Clifton',
      city: 'Karachi',
      address: 'Block 9, Ocean Mall Clifton',
      phone: '+922135899201',
      email: 'clifton@rainbowcc.com.pk',
      latitude: 24.8138,
      longitude: 67.0300,
      deliveryRadiusKm: 8,
      operatingHours: '09:00 AM - 12:00 AM',
      maxCapacityOrders: 70,
      activeOrders: 62,
      utilizationRate: 89,
      pickersOnDuty: 8,
      ridersAvailable: 12,
      status: 'Active',
      autoRerouteThreshold: 85,
      instantDeliveryEnabled: true,
      codMaxLimit: 75000
    },
    {
      id: 'GSH-01',
      branchCode: 'GSH-01',
      name: 'Rainbow Superstore - Gulshan',
      city: 'Karachi',
      address: 'Block 5, Main Rashid Minhas Road, Gulshan-e-Iqbal',
      phone: '+922134981100',
      email: 'gulshan@rainbowcc.com.pk',
      latitude: 24.9207,
      longitude: 67.0935,
      deliveryRadiusKm: 10,
      operatingHours: '08:00 AM - 12:00 AM',
      maxCapacityOrders: 80,
      activeOrders: 52,
      utilizationRate: 65,
      pickersOnDuty: 9,
      ridersAvailable: 15,
      status: 'Active',
      autoRerouteThreshold: 80,
      instantDeliveryEnabled: true,
      codMaxLimit: 80000
    },
    {
      id: 'NNZ-01',
      branchCode: 'NNZ-01',
      name: 'Rainbow Superstore - North Nazimabad',
      city: 'Karachi',
      address: 'Block H, North Nazimabad Central',
      phone: '+922136648900',
      email: 'nazimabad@rainbowcc.com.pk',
      latitude: 24.9421,
      longitude: 67.0456,
      deliveryRadiusKm: 9,
      operatingHours: '08:30 AM - 11:30 PM',
      maxCapacityOrders: 55,
      activeOrders: 31,
      utilizationRate: 56,
      pickersOnDuty: 6,
      ridersAvailable: 7,
      status: 'Active',
      autoRerouteThreshold: 80,
      instantDeliveryEnabled: true,
      codMaxLimit: 50000
    },
    {
      id: 'DHA-06',
      branchCode: 'DHA-06',
      name: 'Rainbow Superstore - DHA Phase 6',
      city: 'Karachi',
      address: 'Khayaban-e-Shahbaz, DHA Phase 6',
      phone: '+922135340022',
      email: 'dha6@rainbowcc.com.pk',
      latitude: 24.7865,
      longitude: 67.0684,
      deliveryRadiusKm: 7,
      operatingHours: '09:00 AM - 11:30 PM',
      maxCapacityOrders: 50,
      activeOrders: 24,
      utilizationRate: 48,
      pickersOnDuty: 5,
      ridersAvailable: 8,
      status: 'Active',
      autoRerouteThreshold: 80,
      instantDeliveryEnabled: true,
      codMaxLimit: 100000
    },
    {
      id: 'BHR-01',
      branchCode: 'BHR-01',
      name: 'Rainbow Superstore - Bahria Town',
      city: 'Karachi',
      address: 'Commercial Midway, Bahria Town',
      phone: '+922138901234',
      email: 'bahriatown@rainbowcc.com.pk',
      latitude: 24.9982,
      longitude: 67.3129,
      deliveryRadiusKm: 15,
      operatingHours: '09:00 AM - 11:00 PM',
      maxCapacityOrders: 45,
      activeOrders: 22,
      utilizationRate: 49,
      pickersOnDuty: 4,
      ridersAvailable: 6,
      status: 'Active',
      autoRerouteThreshold: 80,
      instantDeliveryEnabled: true,
      codMaxLimit: 50000
    },
    {
      id: 'FBA-01',
      branchCode: 'FBA-01',
      name: 'Rainbow Superstore - FB Area',
      city: 'Karachi',
      address: 'Block 14, Federal B Area',
      phone: '+922136324411',
      email: 'fbarea@rainbowcc.com.pk',
      latitude: 24.9351,
      longitude: 67.0722,
      deliveryRadiusKm: 7,
      operatingHours: '08:30 AM - 11:00 PM',
      maxCapacityOrders: 40,
      activeOrders: 18,
      utilizationRate: 45,
      pickersOnDuty: 4,
      ridersAvailable: 5,
      status: 'Active',
      autoRerouteThreshold: 80,
      instantDeliveryEnabled: true,
      codMaxLimit: 40000
    },
    {
      id: 'HYD-01',
      branchCode: 'HYD-01',
      name: 'Rainbow Superstore - Hyderi',
      city: 'Karachi',
      address: 'Hyderi Market, Block G, North Nazimabad',
      phone: '+922136671290',
      email: 'hyderi@rainbowcc.com.pk',
      latitude: 24.9450,
      longitude: 67.0390,
      deliveryRadiusKm: 6,
      operatingHours: '09:00 AM - 11:00 PM',
      maxCapacityOrders: 35,
      activeOrders: 14,
      utilizationRate: 40,
      pickersOnDuty: 3,
      ridersAvailable: 4,
      status: 'Active',
      autoRerouteThreshold: 80,
      instantDeliveryEnabled: true,
      codMaxLimit: 40000
    }
  ];

  private initialCapacities: StoreCapacity[] = this.initialBranches.map(b => ({
    branchCode: b.branchCode,
    branchName: b.name,
    maxCapacityOrders: b.maxCapacityOrders,
    activeOrders: b.activeOrders,
    utilizationRate: b.utilizationRate,
    status: b.status === 'Paused' ? 'Paused' : b.utilizationRate >= 80 ? 'High Load' : 'Optimal',
    isPaused: b.status === 'Paused'
  }));

  private configSubject = new BehaviorSubject<AutomationThresholdConfig>(this.defaultConfig);
  public config$: Observable<AutomationThresholdConfig> = this.configSubject.asObservable();

  private capacitiesSubject = new BehaviorSubject<StoreCapacity[]>(this.initialCapacities);
  public capacities$: Observable<StoreCapacity[]> = this.capacitiesSubject.asObservable();

  private branchesSubject = new BehaviorSubject<RainbowBranch[]>(this.initialBranches);
  private branchRulesSubject = new BehaviorSubject<BranchAutomationRule[]>(this.initialBranchRules);
  public branchRules$: Observable<BranchAutomationRule[]> = this.branchRulesSubject.asObservable();
  public branches$: Observable<RainbowBranch[]> = this.branchesSubject.asObservable();

  constructor() {
    this.loadConfig();
    this.loadBranches();
    this.loadCapacities();
    this.loadBranchRules();
  }

  get config(): AutomationThresholdConfig {
    return this.configSubject.value;
  }

  get capacities(): StoreCapacity[] {
    return this.capacitiesSubject.value;
  }

  get branches(): RainbowBranch[] {
    return this.branchesSubject.value;
  }

  getBranchCapacity(branchCode: string): StoreCapacity | undefined {
    return this.capacities.find(c => c.branchCode === branchCode);
  }

  getBranch(branchCode: string): RainbowBranch | undefined {
    return this.branches.find(b => b.branchCode === branchCode || b.id === branchCode);
  }

  
  get branchRules(): BranchAutomationRule[] {
    return this.branchRulesSubject.value;
  }

  getBranchRule(branchCode: string): BranchAutomationRule {
    const found = this.branchRules.find(r => r.branchCode === branchCode);
    if (found) return found;
    const branch = this.getBranch(branchCode);
    return this.defaultBranchRule(branchCode, branch?.name || 'Rainbow Superstore', branch?.city || 'Lahore', branch?.maxCapacityOrders || 50);
  }

  saveBranchRule(rule: BranchAutomationRule, actor: any): void {
    const list = [...this.branchRulesSubject.value];
    const idx = list.findIndex(r => r.branchCode === rule.branchCode);
    if (idx !== -1) {
      list[idx] = { ...rule };
    } else {
      list.push({ ...rule });
    }
    this.branchRulesSubject.next(list);

    // Also synchronize branch capacity if provided
    if (rule.maxCapacityOrders !== undefined) {
      this.updateBranchCapacity(rule.branchCode, rule.maxCapacityOrders, actor);
    }

    try {
      localStorage.setItem(this.BRANCH_RULES_KEY, JSON.stringify(list));
    } catch {}

    this.auditService.logAction({
      actorId: actor?.id?.toString() || 'ADM-01',
      actorName: actor?.name || 'Administrator',
      actorRole: actor?.role || 'Admin',
      branchCode: rule.branchCode,
      action: 'Update Branch Automation Rules',
      entityType: 'Threshold',
      entityId: rule.branchCode,
      newValue: `Dispatcher Threshold: ${rule.dispatcherMaxOrdersThreshold}, Rider Threshold: ${rule.riderMaxOrdersThreshold}, BM Refund: Rs. ${rule.bmRefundLimitPkr}`,
      reason: 'Updated branch queue thresholds and automation limits',
      details: `Branch: ${rule.branchName}`
    });
  }

  applyRuleToAllBranches(sourceRule: BranchAutomationRule, actor: any): void {
    const list = this.branches.map(b => ({
      ...sourceRule,
      branchCode: b.branchCode,
      branchName: b.name,
      city: b.city
    }));
    this.branchRulesSubject.next(list);
    try {
      localStorage.setItem(this.BRANCH_RULES_KEY, JSON.stringify(list));
    } catch {}

    this.auditService.logAction({
      actorId: actor?.id?.toString() || 'ADM-01',
      actorName: actor?.name || 'Administrator',
      actorRole: actor?.role || 'Admin',
      branchCode: 'ALL',
      action: 'Apply Automation Rules to All Branches',
      entityType: 'Threshold',
      entityId: 'ALL-BRANCHES',
      newValue: `Dispatcher Threshold: ${sourceRule.dispatcherMaxOrdersThreshold}, Rider Threshold: ${sourceRule.riderMaxOrdersThreshold}`,
      reason: 'Standardized operational queue thresholds across all retail superstores'
    });
  }

  private loadBranchRules(): void {
    try {
      const saved = localStorage.getItem(this.BRANCH_RULES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = parsed.map(r => ({
            ...this.defaultBranchRule(r.branchCode, r.branchName, r.city, r.maxCapacityOrders || 50),
            ...r,
            dispatcherMaxOrdersThreshold: r.dispatcherMaxOrdersThreshold ?? 10,
            autoAssignDispatcherOnAccept: r.autoAssignDispatcherOnAccept !== false,
            priorityDispatcherRouting: r.priorityDispatcherRouting !== false,
            riderMaxOrdersThreshold: r.riderMaxOrdersThreshold ?? 3,
            autoAssignRiderOnReadyToPick: r.autoAssignRiderOnReadyToPick !== false,
            priorityRiderRouting: r.priorityRiderRouting !== false,
          }));
          this.branchRulesSubject.next(merged);
        }
      }
    } catch {}
  }

  saveBranch(branch: RainbowBranch, actor: any, isNew: boolean = false): void {
    const list = [...this.branchesSubject.value];
    const oldBranch = list.find(b => b.branchCode === branch.branchCode || b.id === branch.id);

    branch.utilizationRate = Math.round((branch.activeOrders / Math.max(1, branch.maxCapacityOrders)) * 100);

    if (isNew || !oldBranch) {
      list.unshift(branch);
      this.auditService.logAction({
        actorId: actor?.id?.toString() || 'ADM-01',
        actorName: actor?.name || 'Administrator',
        actorRole: actor?.role || 'Admin',
        branchCode: branch.branchCode,
        action: 'Create New Branch',
        entityType: 'Branch',
        entityId: branch.branchCode,
        newValue: `${branch.name} (${branch.city}) - Radius ${branch.deliveryRadiusKm}km, Max Cap ${branch.maxCapacityOrders}`,
        reason: 'Network expansion or new superstore opening',
        details: `Address: ${branch.address}, Hours: ${branch.operatingHours}`
      });
    } else {
      const idx = list.findIndex(b => b.branchCode === branch.branchCode || b.id === branch.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...branch };
      }
      this.auditService.logAction({
        actorId: actor?.id?.toString() || 'ADM-01',
        actorName: actor?.name || 'Administrator',
        actorRole: actor?.role || 'Admin',
        branchCode: branch.branchCode,
        action: 'Update Branch Details',
        entityType: 'Branch',
        entityId: branch.branchCode,
        oldValue: `${oldBranch.name} (Cap: ${oldBranch.maxCapacityOrders}, Status: ${oldBranch.status})`,
        newValue: `${branch.name} (Cap: ${branch.maxCapacityOrders}, Status: ${branch.status})`,
        reason: 'Operational adjustments to hours, capacity, coordinates, or limits',
        details: `Hours: ${branch.operatingHours}, Auto-reroute: ${branch.autoRerouteThreshold}%`
      });
    }

    this.branchesSubject.next(list);
    this.syncCapacitiesFromBranches(list);

    try {
      localStorage.setItem(this.BRANCHES_KEY, JSON.stringify(list));
    } catch {}
  }

  toggleBranchStatus(branchCode: string, newStatus: 'Active' | 'Paused' | 'Inactive', reason: string, actor: any): void {
    const list = [...this.branchesSubject.value];
    const target = list.find(b => b.branchCode === branchCode || b.id === branchCode);
    if (target) {
      const oldStatus = target.status;
      target.status = newStatus;
      this.branchesSubject.next(list);
      this.syncCapacitiesFromBranches(list);

      try {
        localStorage.setItem(this.BRANCHES_KEY, JSON.stringify(list));
      } catch {}

      this.auditService.logAction({
        actorId: actor?.id?.toString() || 'MOD-01',
        actorName: actor?.name || 'Operational Actor',
        actorRole: actor?.role || 'Moderator',
        branchCode,
        action: `Change Branch Status (${newStatus})`,
        entityType: 'Branch',
        entityId: branchCode,
        oldValue: oldStatus,
        newValue: newStatus,
        reason,
        details: `Store operational influx set to ${newStatus}`
      });
    }
  }

  private syncCapacitiesFromBranches(branches: RainbowBranch[]): void {
    const updatedCapacities: StoreCapacity[] = branches.map(b => ({
      branchCode: b.branchCode,
      branchName: b.name,
      maxCapacityOrders: b.maxCapacityOrders,
      activeOrders: b.activeOrders,
      utilizationRate: b.utilizationRate,
      status: b.status === 'Paused' ? 'Paused' : b.utilizationRate >= 80 ? 'High Load' : 'Optimal',
      isPaused: b.status === 'Paused',
      pausedReason: b.status === 'Paused' ? 'Operational pause' : undefined
    }));
    this.capacitiesSubject.next(updatedCapacities);
    try {
      localStorage.setItem(this.CAPACITIES_KEY, JSON.stringify(updatedCapacities));
    } catch {}
  }

  private loadBranches(): void {
    try {
      const saved = localStorage.getItem(this.BRANCHES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.branchesSubject.next(parsed);
          this.syncCapacitiesFromBranches(parsed);
        }
      }
    } catch {}
  }

  updateConfig(newConfig: AutomationThresholdConfig, actor: any, reason: string): void {
    const oldConfig = this.configSubject.value;
    this.configSubject.next(newConfig);
    try {
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(newConfig));
    } catch {}

    this.auditService.logAction({
      actorId: actor?.id?.toString() || 'ADM-01',
      actorName: actor?.name || 'Administrator',
      actorRole: actor?.role || 'Admin',
      branchCode: actor?.branchCode || 'HQ-ALL',
      action: 'Update Automation Thresholds',
      entityType: 'Threshold',
      entityId: 'SYSTEM-CONFIG',
      oldValue: `P1>=${oldConfig.tiers.p1Min}, Reroute>=${oldConfig.storeLoadThresholds.reroutePercent}%`,
      newValue: `P1>=${newConfig.tiers.p1Min}, Reroute>=${newConfig.storeLoadThresholds.reroutePercent}%`,
      reason,
      details: 'Updated scoring weights, SLA timers, or capacity thresholds'
    });
  }

  updateBranchCapacity(branchCode: string, maxCapacity: number, actor: any): void {
    const current = [...this.capacitiesSubject.value];
    const target = current.find(c => c.branchCode === branchCode);
    if (target) {
      const oldCap = target.maxCapacityOrders;
      target.maxCapacityOrders = maxCapacity;
      target.utilizationRate = Math.round((target.activeOrders / maxCapacity) * 100);
      target.status = target.utilizationRate >= 100 ? 'Overload' : target.utilizationRate >= 80 ? 'High Load' : 'Optimal';
      this.capacitiesSubject.next(current);
      try {
        localStorage.setItem(this.CAPACITIES_KEY, JSON.stringify(current));
      } catch {}

      // Also update branch in branches list
      const branchList = [...this.branchesSubject.value];
      const branchTarget = branchList.find(b => b.branchCode === branchCode);
      if (branchTarget) {
        branchTarget.maxCapacityOrders = maxCapacity;
        branchTarget.utilizationRate = target.utilizationRate;
        this.branchesSubject.next(branchList);
        try {
          localStorage.setItem(this.BRANCHES_KEY, JSON.stringify(branchList));
        } catch {}
      }

      this.auditService.logAction({
        actorId: actor?.id?.toString() || 'MGR-01',
        actorName: actor?.name || 'Manager',
        actorRole: actor?.role || 'Branch Manager',
        branchCode,
        action: 'Update Store Capacity',
        entityType: 'Branch',
        entityId: branchCode,
        oldValue: `${oldCap} active orders limit`,
        newValue: `${maxCapacity} active orders limit (${target.utilizationRate}% utilized)`,
        reason: 'Adjusted physical picking capacity and active packer quota.'
      });
    }
  }

  toggleBranchPause(branchCode: string, paused: boolean, reason: string, actor: any): void {
    const current = [...this.capacitiesSubject.value];
    const target = current.find(c => c.branchCode === branchCode);
    if (target) {
      target.isPaused = paused;
      target.pausedReason = paused ? reason : undefined;
      target.status = paused ? 'Paused' : target.utilizationRate >= 80 ? 'High Load' : 'Optimal';
      this.capacitiesSubject.next(current);
      try {
        localStorage.setItem(this.CAPACITIES_KEY, JSON.stringify(current));
      } catch {}

      // Also update branch
      const branchList = [...this.branchesSubject.value];
      const branchTarget = branchList.find(b => b.branchCode === branchCode);
      if (branchTarget) {
        branchTarget.status = paused ? 'Paused' : 'Active';
        this.branchesSubject.next(branchList);
        try {
          localStorage.setItem(this.BRANCHES_KEY, JSON.stringify(branchList));
        } catch {}
      }

      this.auditService.logAction({
        actorId: actor?.id?.toString() || 'MGR-01',
        actorName: actor?.name || 'Manager',
        actorRole: actor?.role || 'Branch Manager',
        branchCode,
        action: paused ? 'Pause Store Influx' : 'Resume Store Influx',
        entityType: 'Branch',
        entityId: branchCode,
        oldValue: paused ? 'Active' : 'Paused',
        newValue: paused ? 'Paused' : 'Active',
        reason
      });
    }
  }

  computePriority(order: any): OrderPriorityDetails {
    // Determine plain, real operational urgency
    let urgency: OrderUrgency = 'Standard';
    let targetPickMinutes = 20;

    const slotLower = (order.deliverySlotWindow || '').toLowerCase();
    const isAsap = order.deliveryType === 'Express' ||
                   order.orderType === 'ASAP' ||
                   slotLower.includes('instant') ||
                   slotLower.includes('30 min') ||
                   slotLower.includes('asap');

    const isScheduled = order.deliveryType === 'Scheduled' ||
                        slotLower.includes('slot') ||
                        slotLower.includes('tomorrow');

    if (isAsap) {
      urgency = 'Urgent';
      targetPickMinutes = 10;
    } else if (isScheduled) {
      urgency = 'Scheduled';
      targetPickMinutes = 45;
    } else {
      urgency = 'Standard';
      targetPickMinutes = 20;
    }

    const now = new Date();
    const deadline = new Date(now.getTime() + targetPickMinutes * 60 * 1000);
    const deadlineTimestamp = deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return {
      urgency,
      targetPickMinutes,
      deadlineTimestamp,
      isOverridden: false,
      tier: urgency === 'Urgent' ? 'P1' : (urgency === 'Scheduled' ? 'P4' : 'P3'),
      score: urgency === 'Urgent' ? 90 : (urgency === 'Scheduled' ? 25 : 60),
      factors: {
        timeToSlot: urgency === 'Urgent' ? 35 : 15,
        orderType: urgency === 'Urgent' ? 20 : 10,
        perishable: 10,
        customerTier: 10,
        ageInQueue: 5,
        orderValue: 10
      }
    };
  }

  private loadConfig(): void {
    try {
      const saved = localStorage.getItem(this.CONFIG_KEY);
      if (saved) {
        this.configSubject.next({ ...this.defaultConfig, ...JSON.parse(saved) });
      }
    } catch {}
  }

  private loadCapacities(): void {
    try {
      const saved = localStorage.getItem(this.CAPACITIES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.capacitiesSubject.next(parsed);
        }
      }
    } catch {}
  }
}
