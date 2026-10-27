import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuditLogEntry } from '@core/models/workflow.model';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private readonly STORAGE_KEY = '_RAINBOW_AUDIT_LOGS_';

  private initialLogs: AuditLogEntry[] = [
    {
      id: 'AUD-9001',
      actorId: 'MOD-VAL-01',
      actorName: 'Imran Tariq',
      actorRole: 'Moderator',
      branchCode: 'VAL-01',
      action: 'Priority Override',
      entityType: 'Priority',
      entityId: '32440315',
      timestamp: '16/10/2026 18:45:12',
      oldValue: 'P3 Standard (Score: 48)',
      newValue: 'P1 Critical (Manual Override)',
      reason: 'Customer reported frozen meat thawing in transit; elevated pick priority.',
      details: 'Elevated from P3 to P1 for urgent pickup.'
    },
    {
      id: 'AUD-9002',
      actorId: 'MOD-VAL-01',
      actorName: 'Imran Tariq',
      actorRole: 'Moderator',
      branchCode: 'VAL-01',
      action: 'Rider Reassignment',
      entityType: 'Rider',
      entityId: '32440317',
      timestamp: '16/10/2026 19:12:05',
      oldValue: 'RDR-VAL-103 (Pending)',
      newValue: 'RDR-VAL-101 (Waqas Ali)',
      reason: 'Primary rider unresponsive after 2 offer rounds.',
      details: 'Reassigned directly to Waqas Ali with motorbike.'
    },
    {
      id: 'AUD-9003',
      actorId: 'ADM-HQ-01',
      actorName: 'Rainbow Super Admin',
      actorRole: 'Admin',
      branchCode: 'HQ-ALL',
      action: 'Threshold Adjustment',
      entityType: 'Threshold',
      entityId: 'TH-STORE-LOAD',
      timestamp: '15/10/2026 14:30:00',
      oldValue: 'Reroute at 85%',
      newValue: 'Reroute at 80%',
      reason: 'Pre-weekend peak volume throttling rule updated.',
      details: 'Configured automated routing threshold from 85% to 80%.'
    },
    {
      id: 'AUD-9004',
      actorId: 'MOD-VAL-01',
      actorName: 'Imran Tariq',
      actorRole: 'Moderator',
      branchCode: 'VAL-01',
      action: 'Refund Approved',
      entityType: 'Refund',
      entityId: 'RET-9821',
      timestamp: '16/10/2026 11:20:18',
      oldValue: 'Pending Return Review (Rs. 1,250)',
      newValue: 'Approved to Customer Wallet',
      reason: 'Damaged packaging verified with delivery photo proof.',
      details: 'Credited Rs. 1,250 to customer in-app wallet within limit.'
    },
    {
      id: 'AUD-9005',
      actorId: 'MOD-VAL-01',
      actorName: 'Imran Tariq',
      actorRole: 'Moderator',
      branchCode: 'VAL-01',
      action: 'TimeLog Correction',
      entityType: 'TimeLog',
      entityId: 'TL-88219',
      timestamp: '16/10/2026 16:05:44',
      oldValue: 'arrived_store @ 15:58:10',
      newValue: 'arrived_store @ 15:52:00',
      reason: 'Store geofence beacon signal dropped during network outage.',
      details: 'Picker confirmed rider physical presence at 15:52.'
    }
  ];

  private logsSubject = new BehaviorSubject<AuditLogEntry[]>([]);
  public logs$: Observable<AuditLogEntry[]> = this.logsSubject.asObservable();

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

  get logs(): AuditLogEntry[] {
    return this.logsSubject.value;
  }

  logAction(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: this.formatNow()
    };
    const updated = [newEntry, ...this.logsSubject.value];
    this.logsSubject.next(updated);
    this.saveLogs(updated);
    return newEntry;
  }

  private saveLogs(logs: AuditLogEntry[]) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
    } catch {
      // Ignore local storage error
    }
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
