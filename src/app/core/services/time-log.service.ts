import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TimeLogRecord, TimeLogEventType } from '@core/models/workflow.model';
import { AuditService } from './audit.service';

export interface DerivedProductivityMetrics {
  storeWaitMinutes: number;      // picked_up - arrived_store
  pickupToDoorMinutes: number;   // delivered - picked_up
  acceptanceSeconds: number;     // offer_accepted - offer_sent
  pickingMinutes: number;        // pick_completed - pick_started
  totalJobMinutes: number;       // job_closed - offer_accepted
}

@Injectable({
  providedIn: 'root'
})
export class TimeLogService {
  private auditService = inject(AuditService);
  private readonly STORAGE_KEY = '_RAINBOW_TIME_LOGS_';

  private initialLogs: TimeLogRecord[] = [
    {
      id: 'TL-1001',
      orderId: '32440315',
      orderCode: 'FZNJ-WLUG6',
      staffId: 'STF-VAL-04',
      staffName: 'Rashid Mehmood (Picker)',
      branchCode: 'VAL-01',
      branchName: 'Rainbow Cash & Carry - Valencia',
      eventType: 'pick_started',
      timestamp: '16/10/2026 18:05:10',
      source: 'automatic',
      notes: 'Picker scanned Order barcode at Shelf Zone A'
    },
    {
      id: 'TL-1002',
      orderId: '32440315',
      orderCode: 'FZNJ-WLUG6',
      staffId: 'STF-VAL-04',
      staffName: 'Rashid Mehmood (Picker)',
      branchCode: 'VAL-01',
      branchName: 'Rainbow Cash & Carry - Valencia',
      eventType: 'pick_completed',
      timestamp: '16/10/2026 18:12:45',
      source: 'automatic',
      notes: 'All 4 SKUs verified; packed in Insulated Bag #14'
    },
    {
      id: 'TL-1003',
      orderId: '32440315',
      orderCode: 'FZNJ-WLUG6',
      staffId: 'STF-VAL-04',
      staffName: 'Rashid Mehmood (Picker)',
      branchCode: 'VAL-01',
      branchName: 'Rainbow Cash & Carry - Valencia',
      eventType: 'ready_marked',
      timestamp: '16/10/2026 18:14:00',
      source: 'automatic',
      notes: 'Order placed in Dispatch Staging Bay #03'
    },
    {
      id: 'TL-1004',
      orderId: '32440315',
      orderCode: 'FZNJ-WLUG6',
      riderId: 'RDR-VAL-101',
      riderName: 'Waqas Ali (Rider)',
      branchCode: 'VAL-01',
      branchName: 'Rainbow Cash & Carry - Valencia',
      eventType: 'offer_sent',
      timestamp: '16/10/2026 18:14:05',
      source: 'automatic',
      notes: 'Push notification offer transmitted to nearest available rider'
    },
    {
      id: 'TL-1005',
      orderId: '32440315',
      orderCode: 'FZNJ-WLUG6',
      riderId: 'RDR-VAL-101',
      riderName: 'Waqas Ali (Rider)',
      branchCode: 'VAL-01',
      branchName: 'Rainbow Cash & Carry - Valencia',
      eventType: 'offer_accepted',
      timestamp: '16/10/2026 18:14:24',
      source: 'automatic',
      notes: 'Accepted in 19 seconds'
    },
    {
      id: 'TL-1006',
      orderId: '32440315',
      orderCode: 'FZNJ-WLUG6',
      riderId: 'RDR-VAL-101',
      riderName: 'Waqas Ali (Rider)',
      branchCode: 'VAL-01',
      branchName: 'Rainbow Cash & Carry - Valencia',
      eventType: 'arrived_store',
      timestamp: '16/10/2026 18:19:30',
      source: 'automatic',
      gpsLocation: { lat: 31.4015, lng: 74.2612 },
      notes: 'Store 100m geofence trigger detected arrival'
    },
    {
      id: 'TL-1007',
      orderId: '32440315',
      orderCode: 'FZNJ-WLUG6',
      riderId: 'RDR-VAL-101',
      riderName: 'Waqas Ali (Rider)',
      branchCode: 'VAL-01',
      branchName: 'Rainbow Cash & Carry - Valencia',
      eventType: 'picked_up',
      timestamp: '16/10/2026 18:22:15',
      source: 'manual',
      notes: 'Order QR code scanned at store dispatch counter'
    },
    {
      id: 'TL-1008',
      orderId: '32440315',
      orderCode: 'FZNJ-WLUG6',
      riderId: 'RDR-VAL-101',
      riderName: 'Waqas Ali (Rider)',
      branchCode: 'VAL-01',
      branchName: 'Rainbow Cash & Carry - Valencia',
      eventType: 'arrived_customer',
      timestamp: '16/10/2026 18:38:40',
      source: 'automatic',
      gpsLocation: { lat: 31.4082, lng: 74.2741 },
      notes: 'Customer location geofence reached'
    },
    {
      id: 'TL-1009',
      orderId: '32440315',
      orderCode: 'FZNJ-WLUG6',
      riderId: 'RDR-VAL-101',
      riderName: 'Waqas Ali (Rider)',
      branchCode: 'VAL-01',
      branchName: 'Rainbow Cash & Carry - Valencia',
      eventType: 'delivered',
      timestamp: '16/10/2026 18:41:20',
      source: 'manual',
      notes: 'Customer OTP verified: 4892. Cash collected Rs. 4,320'
    },
    {
      id: 'TL-1010',
      orderId: '32440315',
      orderCode: 'FZNJ-WLUG6',
      riderId: 'RDR-VAL-101',
      riderName: 'Waqas Ali (Rider)',
      branchCode: 'VAL-01',
      branchName: 'Rainbow Cash & Carry - Valencia',
      eventType: 'job_closed',
      timestamp: '16/10/2026 18:42:00',
      source: 'automatic',
      notes: 'Rider earnings Rs. 140 credited; batch capacity released'
    },
    // Shift logs
    {
      id: 'TL-1011',
      riderId: 'RDR-VAL-101',
      riderName: 'Waqas Ali (Rider)',
      branchCode: 'VAL-01',
      branchName: 'Rainbow Cash & Carry - Valencia',
      eventType: 'shift_start',
      timestamp: '16/10/2026 08:00:15',
      source: 'manual',
      notes: 'Rider clocked in via Rider Mobile App'
    },
    {
      id: 'TL-1012',
      riderId: 'RDR-VAL-102',
      riderName: 'Hamza Shabbir (Rider)',
      branchCode: 'VAL-01',
      branchName: 'Rainbow Cash & Carry - Valencia',
      eventType: 'break_start',
      timestamp: '16/10/2026 13:30:00',
      source: 'manual',
      notes: '30-minute lunch pause'
    },
    {
      id: 'TL-1013',
      riderId: 'RDR-VAL-102',
      riderName: 'Hamza Shabbir (Rider)',
      branchCode: 'VAL-01',
      branchName: 'Rainbow Cash & Carry - Valencia',
      eventType: 'break_end',
      timestamp: '16/10/2026 14:02:10',
      source: 'manual',
      notes: 'Resumed duty, online in dispatch radius'
    }
  ];

  private logsSubject = new BehaviorSubject<TimeLogRecord[]>([]);
  public logs$: Observable<TimeLogRecord[]> = this.logsSubject.asObservable();

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.logsSubject.next(JSON.parse(saved));
      } catch {
        this.logsSubject.next(this.initialLogs);
      }
    } else {
      this.logsSubject.next(this.initialLogs);
      this.saveLogs(this.initialLogs);
    }
  }

  get logs(): TimeLogRecord[] {
    return this.logsSubject.value;
  }

  recordEvent(event: Omit<TimeLogRecord, 'id' | 'timestamp'> & { timestamp?: string }): TimeLogRecord {
    const newRecord: TimeLogRecord = {
      ...event,
      id: `TL-${Date.now().toString().slice(-6)}`,
      timestamp: event.timestamp || this.formatNow()
    };
    const updated = [newRecord, ...this.logsSubject.value];
    this.logsSubject.next(updated);
    this.saveLogs(updated);
    return newRecord;
  }

  correctLog(logId: string, newTimestamp: string, reason: string, actor: any): boolean {
    const logs = [...this.logsSubject.value];
    const target = logs.find(l => l.id === logId);
    if (!target) return false;

    const oldTimestamp = target.timestamp;
    target.originalTimestamp = target.originalTimestamp || oldTimestamp;
    target.timestamp = newTimestamp;
    target.isCorrected = true;
    target.correctedBy = actor?.name || 'Moderator';
    target.correctionReason = reason;
    target.correctedAt = this.formatNow();

    this.logsSubject.next(logs);
    this.saveLogs(logs);

    this.auditService.logAction({
      actorId: actor?.id?.toString() || 'MOD-01',
      actorName: actor?.name || 'Moderator',
      actorRole: actor?.role || 'Moderator',
      branchCode: target.branchCode,
      action: 'Correct TimeLog Entry',
      entityType: 'TimeLog',
      entityId: target.id,
      oldValue: `${target.eventType} @ ${oldTimestamp}`,
      newValue: `${target.eventType} @ ${newTimestamp}`,
      reason,
      details: `Corrected ${target.eventType} for ${target.staffName || target.riderName}`
    });

    return true;
  }

  getOrderMetrics(orderId: string): DerivedProductivityMetrics {
    const orderLogs = this.logs.filter(l => l.orderId === orderId);
    const getTimestamp = (type: TimeLogEventType) => {
      const match = orderLogs.find(l => l.eventType === type);
      return match ? this.parseTimestamp(match.timestamp) : null;
    };

    const offerSent = getTimestamp('offer_sent');
    const offerAccepted = getTimestamp('offer_accepted');
    const pickStarted = getTimestamp('pick_started');
    const pickCompleted = getTimestamp('pick_completed');
    const arrivedStore = getTimestamp('arrived_store');
    const pickedUp = getTimestamp('picked_up');
    const delivered = getTimestamp('delivered');
    const jobClosed = getTimestamp('job_closed');

    const pickingMinutes = (pickStarted && pickCompleted)
      ? Math.max(1, Math.round((pickCompleted.getTime() - pickStarted.getTime()) / 60000))
      : 7;

    const storeWaitMinutes = (arrivedStore && pickedUp)
      ? Math.max(1, Math.round((pickedUp.getTime() - arrivedStore.getTime()) / 60000))
      : 3;

    const pickupToDoorMinutes = (pickedUp && delivered)
      ? Math.max(1, Math.round((delivered.getTime() - pickedUp.getTime()) / 60000))
      : 19;

    const acceptanceSeconds = (offerSent && offerAccepted)
      ? Math.max(1, Math.round((offerAccepted.getTime() - offerSent.getTime()) / 1000))
      : 19;

    const totalJobMinutes = (offerAccepted && jobClosed)
      ? Math.max(1, Math.round((jobClosed.getTime() - offerAccepted.getTime()) / 60000))
      : 28;

    return {
      pickingMinutes,
      storeWaitMinutes,
      pickupToDoorMinutes,
      acceptanceSeconds,
      totalJobMinutes
    };
  }

  private saveLogs(logs: TimeLogRecord[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
    } catch {}
  }

  private parseTimestamp(ts: string): Date | null {
    // Expected format: DD/MM/YYYY HH:MM:SS
    const parts = ts.split(' ');
    if (parts.length < 2) return null;
    const dateParts = parts[0].split('/');
    const timeParts = parts[1].split(':');
    if (dateParts.length < 3 || timeParts.length < 3) return null;
    return new Date(
      parseInt(dateParts[2], 10),
      parseInt(dateParts[1], 10) - 1,
      parseInt(dateParts[0], 10),
      parseInt(timeParts[0], 10),
      parseInt(timeParts[1], 10),
      parseInt(timeParts[2], 10)
    );
  }

  private formatNow(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${mins}:${secs}`;
  }
}
