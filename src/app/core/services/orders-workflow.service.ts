import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RAINBOW_ORDERS, RainbowOrder, RainbowOrderItem, AssignedRider } from '@/app/features/orders/data';
import { RAINBOW_STAFF_MEMBERS, BranchStaff } from '@/app/features/roles/role-list/data';
import {
  OrderLifecycleStatus,
  OrderPriorityDetails,
  PriorityTier,
  OrderException
} from '@core/models/workflow.model';
import { WorkflowConfigService } from './workflow-config.service';
import { AuditService } from './audit.service';
import { TimeLogService } from './time-log.service';
import { AuthenticationService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersWorkflowService {
  private configService = inject(WorkflowConfigService);
  private auditService = inject(AuditService);
  private timeLogService = inject(TimeLogService);
  private authService = inject(AuthenticationService);

  private readonly STORAGE_KEY = '_RAINBOW_ORDERS_STORE_';

  private ordersSubject = new BehaviorSubject<RainbowOrder[]>([]);
  public orders$: Observable<RainbowOrder[]> = this.ordersSubject.asObservable();

  constructor() {
    this.initOrders();
  }

  get orders(): RainbowOrder[] {
    return this.ordersSubject.value;
  }

  private initOrders(): void {
    let sourceOrders: RainbowOrder[] = RAINBOW_ORDERS;
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed: RainbowOrder[] = JSON.parse(saved);
        sourceOrders = parsed.map(p => {
          const base = RAINBOW_ORDERS.find(b => b.id === p.id);
          const baseItems = base?.items || [];
          return {
            ...base,
            ...p,
            substitutionPreference: p.substitutionPreference || base?.substitutionPreference,
            hasOutOfStockItems: p.hasOutOfStockItems !== undefined ? p.hasOutOfStockItems : base?.hasOutOfStockItems,
            dispatcherQueueStatus: p.dispatcherQueueStatus || base?.dispatcherQueueStatus || (p.status === 'Dispatch' ? 'Dispatched' : (p.status === 'Packed' ? 'Ready to Pick' : (p.status === 'Confirmed' ? 'In Dispatcher Queue' : 'Pending Verification'))),
            assignedDispatcher: p.assignedDispatcher || base?.assignedDispatcher,
            verifiedAt: p.verifiedAt || base?.verifiedAt,
            queueEntryTime: p.queueEntryTime || base?.queueEntryTime,
            timeInQueueMinutes: p.timeInQueueMinutes !== undefined ? p.timeInQueueMinutes : (base?.timeInQueueMinutes ?? 5),
            items: (p.items && p.items.length > 0 ? p.items : baseItems).map(it => {
              const matchedBaseItem = baseItems.find(bi => bi.itemId === it.itemId || bi.sku === it.sku);
              return {
                ...matchedBaseItem,
                ...it,
                substitutionOption: it.substitutionOption || matchedBaseItem?.substitutionOption,
                specificReplacements: it.specificReplacements || matchedBaseItem?.specificReplacements,
                originalItemName: it.originalItemName || matchedBaseItem?.originalItemName || it.name,
              };
            })
          };
        });
      } catch {
        sourceOrders = RAINBOW_ORDERS;
      }
    }

    // Enrich orders with dynamic priority scores, tiers, and exception scenarios
    const enriched = sourceOrders.map((order, index) => {
      const priority = this.configService.computePriority(order);

      // Seed realistic exceptions across orders to test moderator queue
      let exception: OrderException | undefined = undefined;
      let hasException = false;

      if (order.id === '32440286') {
        hasException = true;
        exception = {
          id: 'EXP-101',
          type: 'item_out_of_stock',
          title: 'Stock Depletion: Dalda Cooking Oil 5L',
          details: 'Item out of stock during picking. Customer requested: Call Me for replacement (+92 310 4442625).',
          severity: 'high',
          flaggedAt: '14/10/2026 19:10:00',
          status: 'Pending Review'
        };
      } else if (order.id === '32440180') {
        hasException = true;
        exception = {
          id: 'EXP-102',
          type: 'item_out_of_stock',
          title: "Stock Depletion: K&N's Shashlik",
          details: 'Item not found on freezer shelf. Customer preference: Substitute with best alternative.',
          severity: 'high',
          flaggedAt: '14/10/2026 19:12:10',
          status: 'Pending Review'
        };
      } else if (order.id === '32440047') {
        hasException = true;
        exception = {
          id: 'EXP-103',
          type: 'no_rider_accepted',
          title: 'Rider Offer Timeout (Round 2)',
          details: 'No nearby rider accepted offer in 3 km radius. Ready for pickup over 4 minutes in staging bay.',
          severity: 'critical',
          flaggedAt: '14/10/2026 19:14:45',
          status: 'Pending Review'
        };
      } else if (order.id === '32439922') {
        hasException = true;
        exception = {
          id: 'EXP-104',
          type: 'eta_slip',
          title: 'Delivery ETA Breach (+14 mins)',
          details: 'Promised slot was 18:30. Traffic closure on Ring Road delayed rider delivery.',
          severity: 'medium',
          flaggedAt: '14/10/2026 19:16:10',
          status: 'Pending Review'
        };
      }

      return {
        ...order,
        priorityScore: priority.score,
        urgency: priority.urgency,
        priorityTier: priority.tier,
        priorityDetails: priority,
        hasException,
        exception,
        queueAgeMins: order.queueAgeMins ?? (index * 3 + 2),
        deliverySlotWindow: order.deliverySlotWindow || (order.deliveryTimeType === 'ASAP' ? 'ASAP (within 35m)' : '08:00 PM - 09:00 PM')
      };
    });

    this.ordersSubject.next(enriched);
  }

  /**
   * Filter orders by role permissions and scoping
   */
  getScopedOrders(user: any): RainbowOrder[] {
    const all = this.ordersSubject.value;
    if (!user || user.role === 'Admin' || user.role === 'Moderator') {
      return all; // Full cross-branch operational visibility
    }
    // Branch Manager is strictly scoped to assigned branch
    const branchCode = user.branchCode || 'VAL-01';
    return all.filter(o => o.branchCode === branchCode || o.branch.includes(branchCode));
  }

  /**
   * Authorized Priority Override (requires mandatory reason)
   */
  overridePriority(orderId: string, newUrgencyOrTier: any, reason: string, actor: any): boolean {
    if (!reason || reason.trim().length < 5) {
      throw new Error('A valid mandatory reason (minimum 5 characters) is required for priority override.');
    }

    const currentOrders = [...this.ordersSubject.value];
    const order = currentOrders.find(o => o.id === orderId);
    if (!order) return false;

    const oldUrgency = order.urgency || (order.priorityTier === 'P1' ? 'Urgent' : (order.priorityTier === 'P4' ? 'Scheduled' : 'Standard'));
    let newUrgency: 'Urgent' | 'Standard' | 'Scheduled' = 'Standard';
    let newTier: PriorityTier = 'P3';
    let newScore = 60;

    if (newUrgencyOrTier === 'Urgent' || newUrgencyOrTier === 'P1' || newUrgencyOrTier === 'P2') {
      newUrgency = 'Urgent';
      newTier = 'P1';
      newScore = 90;
    } else if (newUrgencyOrTier === 'Scheduled' || newUrgencyOrTier === 'P4') {
      newUrgency = 'Scheduled';
      newTier = 'P4';
      newScore = 25;
    } else {
      newUrgency = 'Standard';
      newTier = 'P3';
      newScore = 60;
    }

    order.urgency = newUrgency;
    order.priorityTier = newTier;
    order.priorityScore = newScore;
    order.priorityDetails = {
      ...(order.priorityDetails || this.configService.computePriority(order)),
      urgency: newUrgency,
      targetPickMinutes: newUrgency === 'Urgent' ? 10 : (newUrgency === 'Scheduled' ? 45 : 20),
      score: newScore,
      tier: newTier,
      isOverridden: true,
      overriddenUrgency: newUrgency,
      overriddenTier: newTier,
      overrideReason: reason,
      overriddenBy: actor?.name || 'Moderator',
      overriddenAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.ordersSubject.next(currentOrders);
    this.saveOrders(currentOrders);

    this.auditService.logAction({
      actorId: actor?.id?.toString() || 'MOD-01',
      actorName: actor?.name || 'Moderator',
      actorRole: actor?.role || 'Moderator',
      branchCode: order.branchCode,
      action: 'Priority Override',
      entityType: 'Priority',
      entityId: order.id,
      oldValue: `${oldUrgency}`,
      newValue: `${newUrgency} (${newTier})`,
      reason,
      details: `Order urgency manually adjusted from ${oldUrgency} to ${newUrgency}.`
    });

    return true;
  }

  /**
   * Reassign Order to another Branch (with capacity check)
   */
  reassignBranch(orderId: string, targetBranchCode: string, targetBranchName: string, reason: string, actor: any): boolean {
    const currentOrders = [...this.ordersSubject.value];
    const order = currentOrders.find(o => o.id === orderId);
    if (!order) return false;

    const oldBranch = order.branch;
    order.branchCode = targetBranchCode;
    order.branch = targetBranchName;

    // Clear previous assigned rider if branch changed
    order.assignedRider = undefined;

    this.ordersSubject.next(currentOrders);
    this.saveOrders(currentOrders);

    this.auditService.logAction({
      actorId: actor?.id?.toString() || 'MOD-01',
      actorName: actor?.name || 'Moderator',
      actorRole: actor?.role || 'Moderator',
      branchCode: targetBranchCode,
      action: 'Reassign Store Outlet',
      entityType: 'Branch',
      entityId: order.id,
      oldValue: oldBranch,
      newValue: targetBranchName,
      reason,
      details: `Order #${order.id} rerouted from ${oldBranch} to ${targetBranchName}.`
    });

    return true;
  }

  /**
   * Assign or Reassign Delivery Rider
   */
  assignRider(orderId: string, rider: BranchStaff, actor: any): boolean {
    const currentOrders = [...this.ordersSubject.value];
    const order = currentOrders.find(o => o.id === orderId);
    if (!order) return false;

    const oldRiderName = order.assignedRider?.name || 'Unassigned';

    const assignedRider: AssignedRider = {
      id: rider.id,
      name: rider.name,
      phone: rider.phone,
      avatar: rider.avatar,
      vehicleType: rider.riderDetails?.vehicleType || 'Motorbike',
      vehicleRegNo: rider.riderDetails?.vehicleRegNo || 'LEA-2024-9988',
      rating: rider.riderDetails?.rating || 4.8,
      assignedAt: new Date().toLocaleTimeString(),
      deliveryStatus: 'Assigned'
    };

    order.assignedRider = assignedRider;
    if (order.status === 'Pending' || order.status === 'Placed' || order.status === 'Confirmed' || order.status === 'Packed') {
      order.status = 'Rider assigned';
    }

    this.ordersSubject.next(currentOrders);
    this.saveOrders(currentOrders);

    // Record authoritative time logs
    this.timeLogService.recordEvent({
      orderId: order.id,
      orderCode: order.uniqueCode,
      riderId: rider.id,
      riderName: `${rider.name} (Rider)`,
      branchCode: order.branchCode,
      branchName: order.branch,
      eventType: 'offer_accepted',
      source: 'manual',
      notes: `Rider ${rider.name} assigned by ${actor?.name || 'Moderator'}`
    });

    this.auditService.logAction({
      actorId: actor?.id?.toString() || 'MOD-01',
      actorName: actor?.name || 'Moderator',
      actorRole: actor?.role || 'Moderator',
      branchCode: order.branchCode,
      action: 'Rider Assignment',
      entityType: 'Rider',
      entityId: order.id,
      oldValue: oldRiderName,
      newValue: `${rider.name} (${assignedRider.vehicleRegNo})`,
      reason: 'Assigned by Operations Console',
      details: `Rider assigned to Order #${order.id}`
    });

    return true;
  }

  /**
   * Get Dispatchers for a given branch
   */
  getStoreDispatchers(branchCode: string): BranchStaff[] {
    const list = RAINBOW_STAFF_MEMBERS.filter(s => s.role === 'Dispatcher');
    if (!branchCode || branchCode === 'all') {
      return list;
    }
    const branchSpecific = list.filter(s => s.branchCode === branchCode || s.branchId === branchCode);
    return branchSpecific.length > 0 ? branchSpecific : list;
  }

  /**
   * Get Fleet Riders for a given branch
   */
  getStoreRiders(branchCode: string): BranchStaff[] {
    const list = RAINBOW_STAFF_MEMBERS.filter(s => s.role === 'Rider');
    if (!branchCode || branchCode === 'all') {
      return list;
    }
    const branchSpecific = list.filter(s => s.branchCode === branchCode || s.branchId === branchCode);
    return branchSpecific.length > 0 ? branchSpecific : list;
  }

  /**
   * Step 1: Accept/Verify Order from Customer -> Automatically Enters Store Dispatcher Queue
   * Governed by Dispatcher Queue Threshold settling in store automation.
   */
  confirmAndQueueOrder(orderId: string, actor: any, note?: string): { success: boolean; message: string; autoRerouted?: boolean } {
    const currentOrders = [...this.ordersSubject.value];
    const order = currentOrders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found.' };

    const oldStatus = order.status;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Automation Queue Threshold & Dispatcher assignment
    const branchRule = this.configService.getBranchRule(order.branchCode);
    const maxDispatcherOrders = branchRule.dispatcherMaxOrdersThreshold || 10;

    // Pick store dispatcher
    const dispatchers = this.getStoreDispatchers(order.branchCode);
    const chosenDispatcher = dispatchers.find(d => d.status === 'Active') || dispatchers[0] || {
      id: 'DSP-VAL-01',
      name: 'Haris Mehmood',
      phone: '+92 301 5559812',
      dispatcherDetails: { stagingBay: 'Staging Bay 1' }
    };
    order.status = 'Confirmed';
    order.verifiedAt = nowTime;
    order.dispatcherQueueStatus = 'In Dispatcher Queue';
    order.queueEntryTime = nowTime;
    order.assignedDispatcher = {
      id: chosenDispatcher.id,
      name: chosenDispatcher.name,
      bayNumber: '',
      assignedAt: nowTime,
      phone: chosenDispatcher.phone,
      avatar: chosenDispatcher.avatar,
      status: 'Queued'
    };

    const isPriority = order.urgency === 'Urgent' || order.priorityTier === 'P1' || order.priorityTier === 'P2';

    this.ordersSubject.next(currentOrders);
    this.saveOrders(currentOrders);

    // Record authoritative time log event for dispatcher staging
    this.timeLogService.recordEvent({
      orderId: order.id,
      orderCode: order.uniqueCode,
      staffId: chosenDispatcher.id,
      staffName: `${chosenDispatcher.name} (Dispatcher)`,
      branchCode: order.branchCode,
      branchName: order.branch,
      eventType: 'pick_started',
      source: 'manual',
      notes: `Order verified from customer and queued to dispatcher ${chosenDispatcher.name} (Threshold: ${maxDispatcherOrders} active orders). ${isPriority ? '[PRIORITY FAST-TRACK]' : ''} ${note || ''}`.trim()
    });

    this.auditService.logAction({
      actorId: actor?.id?.toString() || 'MOD-01',
      actorName: actor?.name || 'Moderator',
      actorRole: actor?.role || 'Moderator',
      branchCode: order.branchCode,
      action: 'Verify & Queue to Dispatcher',
      entityType: 'Order',
      entityId: order.id,
      oldValue: oldStatus,
      newValue: 'Confirmed & Queued',
      reason: note || 'Customer order verified and placed in Store Dispatcher Queue',
      details: `Order #${order.id} admitted to ${order.branch} queue. Dispatcher: ${chosenDispatcher.name}. Threshold cap: ${maxDispatcherOrders} orders. ${isPriority ? 'Priority order fast-tracked.' : ''}`
    });

    return {
      success: true,
      message: `Order #${order.id} verified from customer and successfully admitted to Dispatcher Queue (${chosenDispatcher.name}).`
    };
  }

  /**
   * Dispatcher Role Action in Mobile App: Mark Order "Ready for Pickup"
   * Automatically admits order into Rider Queue and offers to fleet rider based on automation threshold.
   */
  markReadyToPick(orderId: string, actor: any, note?: string): { success: boolean; message: string } {
    const currentOrders = [...this.ordersSubject.value];
    const order = currentOrders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found.' };

    const oldStatus = order.status;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const branchRule = this.configService.getBranchRule(order.branchCode);

    order.status = 'Packed';
    order.dispatcherQueueStatus = 'Ready to Pick';
    if (order.assignedDispatcher) {
      order.assignedDispatcher.status = 'Ready to Pick';
    }

    // Automatically admit order into Rider Queue if enabled (default: true)
    let riderAllocationMsg = '';
    const shouldAutoAssignRider = branchRule.autoAssignRiderOnReadyToPick !== false;

    if (shouldAutoAssignRider && !order.assignedRider) {
      const maxRiderOrders = branchRule.riderMaxOrdersThreshold || 3;
      const riders = this.getStoreRiders(order.branchCode);
      const chosenRider = riders.find(r => r.status === 'Active') || riders[0];

      if (chosenRider) {
        order.assignedRider = {
          id: chosenRider.id,
          name: chosenRider.name,
          phone: chosenRider.phone,
          avatar: chosenRider.avatar,
          vehicleType: chosenRider.riderDetails?.vehicleType || 'Motorbike',
          vehicleRegNo: chosenRider.riderDetails?.vehicleRegNo || 'LEA-2024-9988',
          rating: chosenRider.riderDetails?.rating || 4.8,
          assignedAt: nowTime,
          deliveryStatus: 'Assigned'
        };
        order.status = 'Rider assigned';
        riderAllocationMsg = ` Admitted to Rider Queue (${chosenRider.name}, Cap: ${maxRiderOrders}).`;
      }
    }

    this.ordersSubject.next(currentOrders);
    this.saveOrders(currentOrders);

    const dispatcherName = order.assignedDispatcher?.name || actor?.name || 'Store Dispatcher';

    this.timeLogService.recordEvent({
      orderId: order.id,
      orderCode: order.uniqueCode,
      staffId: order.assignedDispatcher?.id || actor?.id?.toString() || 'DSP-01',
      staffName: `${dispatcherName} (Dispatcher)`,
      branchCode: order.branchCode,
      branchName: order.branch,
      eventType: 'ready_marked',
      source: 'manual',
      notes: note || `Order marked Ready for Pickup by Dispatcher ${dispatcherName}.${riderAllocationMsg}`
    });

    this.auditService.logAction({
      actorId: actor?.id?.toString() || 'DSP-01',
      actorName: actor?.name || dispatcherName,
      actorRole: actor?.role || 'Dispatcher',
      branchCode: order.branchCode,
      action: 'Mark Ready for Pickup',
      entityType: 'Order',
      entityId: order.id,
      oldValue: oldStatus,
      newValue: order.status,
      reason: note || 'Order packing completed by Dispatcher; entered Rider Queue',
      details: `Order #${order.id} marked Ready for Pickup by ${dispatcherName}.${riderAllocationMsg}`
    });

    return {
      success: true,
      message: `Order #${order.id} marked Ready for Pickup and routed to Rider Queue!`
    };
  }

  /**
   * Moderator Control: Reassign Dispatcher & Staging Bay
   */
  reassignDispatcher(orderId: string, dispatcher: BranchStaff, stagingBay: string, reason: string, actor: any): { success: boolean; message: string } {
    const currentOrders = [...this.ordersSubject.value];
    const order = currentOrders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found.' };

    const oldDispatcherName = order.assignedDispatcher ? order.assignedDispatcher.name : 'Unassigned';
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    order.assignedDispatcher = {
      id: dispatcher.id,
      name: dispatcher.name,
      bayNumber: stagingBay || '',
      assignedAt: nowTime,
      phone: dispatcher.phone,
      avatar: dispatcher.avatar,
      status: order.dispatcherQueueStatus === 'Ready to Pick' ? 'Ready to Pick' : 'Queued'
    };

    this.ordersSubject.next(currentOrders);
    this.saveOrders(currentOrders);

    this.auditService.logAction({
      actorId: actor?.id?.toString() || 'MOD-01',
      actorName: actor?.name || 'Moderator',
      actorRole: actor?.role || 'Moderator',
      branchCode: order.branchCode,
      action: 'Reassign Store Dispatcher',
      entityType: 'Order',
      entityId: order.id,
      oldValue: oldDispatcherName,
      newValue: dispatcher.name,
      reason: reason || 'Operational queue balancing by Moderator',
      details: `Dispatcher for Order #${order.id} changed to ${dispatcher.name}.`
    });

    return {
      success: true,
      message: `Dispatcher for Order #${order.id} successfully reassigned to ${dispatcher.name}.`
    };
  }

  /**
   * Update Order Lifecycle Status
   */
  updateOrderStatus(orderId: string, newStatus: OrderLifecycleStatus, actor: any, note?: string): boolean {
    const currentOrders = [...this.ordersSubject.value];
    const order = currentOrders.find(o => o.id === orderId);
    if (!order) return false;

    const oldStatus = order.status;
    order.status = newStatus;

    // Record corresponding time log events based on status
    if (newStatus === 'Picking') {
      this.timeLogService.recordEvent({
        orderId: order.id,
        orderCode: order.uniqueCode,
        staffId: actor?.id?.toString() || 'STF-01',
        staffName: actor?.name || 'Store Staff',
        branchCode: order.branchCode,
        branchName: order.branch,
        eventType: 'pick_started',
        source: 'manual',
        notes: note || 'Picking commenced by store picker'
      });
    } else if (newStatus === 'Packed') {
      this.timeLogService.recordEvent({
        orderId: order.id,
        orderCode: order.uniqueCode,
        staffId: actor?.id?.toString() || 'STF-01',
        staffName: actor?.name || 'Store Staff',
        branchCode: order.branchCode,
        branchName: order.branch,
        eventType: 'ready_marked',
        source: 'manual',
        notes: note || 'Order packed, labeled and placed in dispatch staging bay'
      });
    } else if (newStatus === 'Out for delivery' || newStatus === 'Dispatch') {
      this.timeLogService.recordEvent({
        orderId: order.id,
        orderCode: order.uniqueCode,
        riderId: order.assignedRider?.id || 'RDR-01',
        riderName: order.assignedRider?.name || 'Rider',
        branchCode: order.branchCode,
        branchName: order.branch,
        eventType: 'picked_up',
        source: 'manual',
        notes: 'Handover complete; rider departed store'
      });
    } else if (newStatus === 'Delivered') {
      this.timeLogService.recordEvent({
        orderId: order.id,
        orderCode: order.uniqueCode,
        riderId: order.assignedRider?.id || 'RDR-01',
        riderName: order.assignedRider?.name || 'Rider',
        branchCode: order.branchCode,
        branchName: order.branch,
        eventType: 'delivered',
        source: 'manual',
        notes: 'Delivery completed with OTP / Customer signature proof'
      });
      this.timeLogService.recordEvent({
        orderId: order.id,
        orderCode: order.uniqueCode,
        branchCode: order.branchCode,
        branchName: order.branch,
        eventType: 'job_closed',
        source: 'automatic',
        notes: 'Delivery completed; order job closed'
      });
    }

    this.ordersSubject.next(currentOrders);
    this.saveOrders(currentOrders);

    this.auditService.logAction({
      actorId: actor?.id?.toString() || 'STF-01',
      actorName: actor?.name || 'Staff Member',
      actorRole: actor?.role || 'Staff',
      branchCode: order.branchCode,
      action: 'Update Order Status',
      entityType: 'Order',
      entityId: order.id,
      oldValue: oldStatus,
      newValue: newStatus,
      reason: note || `Progressed from ${oldStatus} to ${newStatus}`
    });

    return true;
  }

  /**
   * Resolve an Exception on a Flagged Order
   */
  resolveException(orderId: string, actionType: string, note: string, actor: any): boolean {
    const currentOrders = [...this.ordersSubject.value];
    const order = currentOrders.find(o => o.id === orderId);
    if (!order || !order.exception) return false;

    order.exception.status = 'Resolved';
    order.exception.resolutionAction = actionType;
    order.exception.resolutionNote = note;
    order.exception.resolvedBy = actor?.name || 'Moderator';
    order.exception.resolvedAt = new Date().toLocaleTimeString();
    order.hasException = false;

    this.ordersSubject.next(currentOrders);
    this.saveOrders(currentOrders);

    this.auditService.logAction({
      actorId: actor?.id?.toString() || 'MOD-01',
      actorName: actor?.name || 'Moderator',
      actorRole: actor?.role || 'Moderator',
      branchCode: order.branchCode,
      action: 'Resolve Flagged Exception',
      entityType: 'Order',
      entityId: order.id,
      oldValue: `${order.exception.type} (Pending)`,
      newValue: `Resolved: ${actionType}`,
      reason: note,
      details: `Exception resolved on Order #${order.id}`
    });

    return true;
  }

  /**
   * Approve Refund / Cancellation within Role Limits
   */
  approveRefundOrCancel(
    orderId: string,
    amount: number,
    action: 'Refund' | 'Cancel',
    reason: string,
    actor: any
  ): { success: boolean; message: string } {
    const limits = this.configService.config.approvalLimits;
    const userRole = actor?.role || 'Moderator';

    // Verify role limits
    if (userRole === 'Branch Manager' && amount > limits.branchManagerMaxRefundPkr) {
      return {
        success: false,
        message: `Amount (Rs. ${amount}) exceeds Branch Manager authorization limit of Rs. ${limits.branchManagerMaxRefundPkr}. Escalated to Moderator.`
      };
    }
    if (userRole === 'Moderator' && amount > limits.moderatorMaxRefundPkr) {
      return {
        success: false,
        message: `Amount (Rs. ${amount}) exceeds Moderator authorization limit of Rs. ${limits.moderatorMaxRefundPkr}. Admin approval required.`
      };
    }

    const currentOrders = [...this.ordersSubject.value];
    const order = currentOrders.find(o => o.id === orderId);
    if (!order) {
      return { success: false, message: 'Order not found.' };
    }

    if (action === 'Cancel') {
      order.status = 'Cancelled';
      order.cancellationReason = reason;
    } else {
      order.status = 'Refunded';
      order.refundAmount = amount;
      order.refundStatus = 'Approved';
      order.refundApprovedBy = actor?.name || 'Moderator';
    }

    this.ordersSubject.next(currentOrders);
    this.saveOrders(currentOrders);

    this.auditService.logAction({
      actorId: actor?.id?.toString() || 'MOD-01',
      actorName: actor?.name || 'Moderator',
      actorRole: userRole,
      branchCode: order.branchCode,
      action: action === 'Cancel' ? 'Order Cancellation Approved' : 'Customer Refund Approved',
      entityType: 'Refund',
      entityId: order.id,
      oldValue: `Order Total Rs. ${order.totalAmount}`,
      newValue: `${action === 'Cancel' ? 'Cancelled' : 'Refund Approved (Rs. ' + amount + ')'}`,
      reason,
      details: `Approved by ${actor?.name} (${userRole}) within configured limit.`
    });

    return {
      success: true,
      message: `${action} of Rs. ${amount} successfully approved and logged to audit trail.`
    };
  }

  /**
   * Update Order Items, Manage Substitutions, or Item Removals
   */
  updateOrderItems(orderId: string, updatedItems: RainbowOrderItem[], actor: any, note?: string): boolean {
    const currentOrders = [...this.ordersSubject.value];
    const order = currentOrders.find(o => o.id === orderId);
    if (!order) return false;

    const oldTotal = order.totalAmount;
    order.items = [...updatedItems];

    // Recalculate subtotal from delivered or valid items
    const subtotal = order.items.reduce((sum, it) => {
      // If item is removed or deliveredQty is 0, don't charge
      if (it.substitutionStatus === 'Removed' || it.deliveredQty === 0) {
        return sum;
      }
      return sum + (it.deliveredQty * it.finalPrice);
    }, 0);

    order.subtotal = subtotal;
    order.totalAmount = Math.max(0, subtotal + (order.deliveryFee || 0) + (order.packagingFee || 0) - (order.discount || 0));

    // Determine if any item is still out of stock without being substituted or removed
    const hasPendingOos = order.items.some(it => it.isOutOfStock && it.substitutionStatus !== 'Substituted' && it.substitutionStatus !== 'Removed');
    order.hasOutOfStockItems = hasPendingOos;

    // If out-of-stock exception existed and all items resolved, resolve exception
    if (!hasPendingOos && order.hasException && order.exception?.type === 'item_out_of_stock') {
      order.hasException = false;
      if (order.exception) {
        order.exception.status = 'Resolved';
        order.exception.resolutionAction = 'item_substitution';
        order.exception.resolutionNote = note || 'All out-of-stock items substituted or removed by Moderator';
        order.exception.resolvedBy = actor?.name || 'Moderator';
        order.exception.resolvedAt = new Date().toLocaleTimeString();
      }
    }

    this.ordersSubject.next(currentOrders);
    this.saveOrders(currentOrders);

    this.auditService.logAction({
      actorId: actor?.id?.toString() || 'MOD-01',
      actorName: actor?.name || 'Moderator',
      actorRole: actor?.role || 'Moderator',
      branchCode: order.branchCode,
      action: 'Order Items & Substitution Update',
      entityType: 'Order',
      entityId: order.id,
      oldValue: `Rs. ${oldTotal.toFixed(2)}`,
      newValue: `Rs. ${order.totalAmount.toFixed(2)}`,
      reason: note || 'Order items edited / substituted by Moderator',
      details: `Items modified on Order #${order.id}. New item count: ${order.items.length}, Net total: Rs. ${order.totalAmount.toFixed(2)}`
    });

    return true;
  }

  /**
   * Cancel Order with mandatory reason category and operational notes
   */
  cancelOrderWithReason(
    orderId: string,
    category: string,
    notes: string,
    notifyCustomer: boolean,
    actor: any
  ): { success: boolean; message: string } {
    if (!category || category.trim().length === 0) {
      return { success: false, message: 'A cancellation category is mandatory.' };
    }

    const currentOrders = [...this.ordersSubject.value];
    const order = currentOrders.find(o => o.id === orderId);
    if (!order) {
      return { success: false, message: 'Order not found.' };
    }

    const oldStatus = order.status;
    order.status = 'Cancelled';
    const combinedReason = notes && notes.trim().length > 0 ? `${category}: ${notes.trim()}` : category;
    order.cancellationReason = combinedReason;
    order.hasException = false;

    this.ordersSubject.next(currentOrders);
    this.saveOrders(currentOrders);

    // Record authoritative time log event
    this.timeLogService.recordEvent({
      orderId: order.id,
      orderCode: order.uniqueCode,
      branchCode: order.branchCode,
      branchName: order.branch,
      eventType: 'job_closed',
      source: 'manual',
      notes: `Order cancelled. Reason: ${combinedReason}${notifyCustomer ? ' (Customer notified)' : ''}`
    });

    this.auditService.logAction({
      actorId: actor?.id?.toString() || 'MOD-01',
      actorName: actor?.name || 'Moderator',
      actorRole: actor?.role || 'Moderator',
      branchCode: order.branchCode,
      action: 'Order Cancelled',
      entityType: 'Order',
      entityId: order.id,
      oldValue: oldStatus,
      newValue: 'Cancelled',
      reason: combinedReason,
      details: `Order #${order.id} cancelled by ${actor?.name || 'Moderator'}. Customer notification: ${notifyCustomer ? 'Sent' : 'Suppressed'}.`
    });

    return {
      success: true,
      message: `Order #${order.id} has been cancelled successfully.`
    };
  }

  private saveOrders(orders: RainbowOrder[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
    } catch {}
  }
}
