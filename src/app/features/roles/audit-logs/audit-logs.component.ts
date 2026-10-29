import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AuditService } from '@core/services/audit.service';
import { AuthenticationService } from '@core/services/auth.service';
import { AuditLogEntry } from '@core/models/workflow.model';
import { ThemedNativeSelectDirective } from '../../products/themed-select/themed-native-select.directive';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgbPaginationModule, NgbTooltipModule, ThemedNativeSelectDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './audit-logs.component.html',
  styles: [`
    .font-jost { font-family: 'Jost', -apple-system, BlinkMacSystemFont, sans-serif; }
    .cat-main-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
      background: #ffffff;
    }
    .filter-segmented-control {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      background: #f1f5f9;
      padding: 4px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .segment-btn {
      padding: 5px 12px;
      font-size: 12.5px;
      font-weight: 600;
      border-radius: 6px;
      border: none;
      background: transparent;
      color: #64748b;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
      &:hover:not(.active) {
        color: #0f172a;
        background: rgba(255, 255, 255, 0.6);
      }
      &.active {
        background: #ffffff;
        color: #2e3192;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
      }
    }
    .table-clean th {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: #475569;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      padding: 11px 14px;
    }
    .table-clean td {
      padding: 12px 14px;
      font-size: 12.5px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }
    .search-box-wrapper {
      position: relative;
      min-width: 240px;
      .search-icon {
        position: absolute;
        left: 11px;
        top: 50%;
        transform: translateY(-50%);
        color: #94a3b8;
        font-size: 15px;
      }
      .search-input {
        padding-left: 32px;
        height: 34px;
        border-radius: 7px;
        border: 1px solid #cbd5e1;
        font-size: 12.5px;
      }
    }
  `]
})
export class AuditLogsComponent implements OnInit {
  auditService = inject(AuditService);
  authService = inject(AuthenticationService);
  currentUser = this.authService.user;

  logs: AuditLogEntry[] = [];
  selectedEntityType: string = 'all';
  searchTerm: string = '';

  pageSize: number = 10;
  currentPage: number = 1;

  ngOnInit(): void {
    this.auditService.logs$.subscribe((entries) => {
      this.logs = entries;
    });
  }

  reloadLogs(): void {
    this.selectedEntityType = 'all';
    this.searchTerm = '';
    this.currentPage = 1;
    this.logs = this.auditService.logs;
  }

  get filteredLogs(): AuditLogEntry[] {
    return this.logs.filter(entry => {
      if (this.selectedEntityType !== 'all' && entry.entityType !== this.selectedEntityType) {
        return false;
      }
      if (this.searchTerm.trim()) {
        const q = this.searchTerm.toLowerCase();
        const mActor = entry.actorName.toLowerCase().includes(q);
        const mAction = entry.action.toLowerCase().includes(q);
        const mEntity = entry.entityId.toLowerCase().includes(q);
        const mReason = (entry.reason || '').toLowerCase().includes(q);
        if (!mActor && !mAction && !mEntity && !mReason) return false;
      }
      return true;
    });
  }

  get paginatedLogs(): AuditLogEntry[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredLogs.slice(start, start + this.pageSize);
  }

  exportAuditCsv(): void {
    const rows = [
      ['Audit ID', 'Timestamp', 'Actor Name', 'Role', 'Branch', 'Action', 'Entity Type', 'Entity ID', 'Old Value', 'New Value', 'Reason']
    ];
    this.filteredLogs.forEach(l => {
      rows.push([
        l.id,
        l.timestamp,
        `"${l.actorName.replace(/"/g, '""')}"`,
        l.actorRole,
        l.branchCode,
        `"${l.action.replace(/"/g, '""')}"`,
        l.entityType,
        l.entityId,
        `"${(l.oldValue || '').replace(/"/g, '""')}"`,
        `"${(l.newValue || '').replace(/"/g, '""')}"`,
        `"${(l.reason || '').replace(/"/g, '""')}"`
      ]);
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rainbow_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
