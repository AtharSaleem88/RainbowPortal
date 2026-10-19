import { showSaveSuccess } from '@/app/helper/save-alert';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbDropdownModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { BranchConfiguration, RAINBOW_ALL_BRANCHES, TimingScheduleBlock } from './branch-data';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DecimalPipe,
    RouterLink,
    NgbDropdownModule,
    NgbModalModule,
    NgbTooltipModule
  ],
  templateUrl: './settings.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [`
    .font-jost {
      font-family: 'Jost', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    /* Console Container Card */
    .cat-main-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
      background: #ffffff;
      overflow: hidden;
    }

    /* KPI Metrics Cards */
    .cat-metric-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
      background: #ffffff;
      padding: 16px 18px;
      height: 100%;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
        border-color: #cbd5e1;
      }
    }
    .cat-metric-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    /* Segmented Controls */
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

    /* Step Wizard Pill */
    .wizard-step-item {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: 8px 14px;
      border-radius: 8px;
      transition: all 0.15s ease;

      &:hover:not(.active) {
        background: #f8fafc;
      }

      &.active {
        background: #eef2ff;
        .step-num {
          background: #2e3192;
          color: #ffffff;
        }
        .step-title {
          color: #2e3192;
          font-weight: 700;
        }
      }

      .step-num {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 700;
        background: #e2e8f0;
        color: #64748b;
      }

      .step-title {
        font-size: 13px;
        font-weight: 600;
        color: #64748b;
      }
    }

    /* Table Styles */
    .table-clean {
      th {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        color: #475569;
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
        padding: 11px 16px;
        user-select: none;
      }
      td {
        padding: 12px 16px;
        font-size: 13px;
        border-bottom: 1px solid #f1f5f9;
        vertical-align: middle;
      }
      tbody tr {
        transition: background-color 0.15s ease;
        &:hover {
          background-color: #f8fafc;
        }
      }
    }

    /* Action Buttons */
    .cat-action-btn {
      width: 30px;
      height: 30px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      color: #64748b;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
      text-decoration: none;

      &:hover {
        background: #f1f5f9;
        color: #2e3192;
        border-color: #cbd5e1;
      }
    }

    /* Modal / Form Buttons */
    .btn-modal-cancel {
      padding: 7px 15px;
      font-size: 12.5px;
      font-weight: 600;
      border-radius: 7px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #475569;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.15s ease;
      &:hover {
        background: #f8fafc;
        color: #0f172a;
      }
    }

    .btn-modal-primary {
      padding: 7px 16px;
      font-size: 12.5px;
      font-weight: 600;
      border-radius: 7px;
      border: 1px solid #2e3192;
      background: #2e3192;
      color: #ffffff;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
      box-shadow: 0 1px 2px rgba(46, 49, 146, 0.2);
      &:hover {
        background: #25287a;
        border-color: #25287a;
      }
    }
  `]
})
export class Settings implements OnInit {
  title = 'Store Branch Settings & Control';
  branches: BranchConfiguration[] = RAINBOW_ALL_BRANCHES;

  // Active Branch being configured
  activeBranchIndex: number = 0;
  get currentBranch(): BranchConfiguration {
    return this.branches[this.activeBranchIndex] || this.branches[0];
  }

  // Wizard Navigation: Step 1 (Address), Step 2 (Settings), Step 3 (Timing), or 'directory'
  currentStep: number = 1;
  viewMode: 'wizard' | 'directory' = 'wizard';

  // Feedback banner
  actionFeedback: string | null = null;

  // Days of week list
  daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Map Zoom Level (visual simulation)
  mapZoom: number = 15;

  ngOnInit(): void {}

  setStep(step: number) {
    this.currentStep = step;
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  switchBranch(branchId: string) {
    const idx = this.branches.findIndex(b => b.id === branchId);
    if (idx !== -1) {
      this.activeBranchIndex = idx;
      this.currentStep = 1;
      this.viewMode = 'wizard';
      this.showNotification(`Loaded configuration for ${this.currentBranch.name}`);
    }
  }

  editBranchFromDirectory(b: BranchConfiguration) {
    this.switchBranch(b.id);
  }

  toggleDay(schedule: TimingScheduleBlock, day: string) {
    schedule.days[day] = !schedule.days[day];
  }

  addTimingBlock() {
    const newId = `sched-custom-${Date.now()}`;
    const newBlock: TimingScheduleBlock = {
      id: newId,
      days: { Sunday: false, Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false, Saturday: false },
      firstHalfOpen: '09:00 AM',
      firstHalfClose: '06:00 PM',
      secondHalfOpen: '06:00 PM',
      secondHalfClose: '10:30 PM',
    };
    this.currentBranch.timing.schedules.push(newBlock);
    this.showNotification('Added new operating timing block.');
  }

  removeTimingBlock(index: number) {
    if (this.currentBranch.timing.schedules.length <= 1) {
      alert('At least one timing schedule block is required.');
      return;
    }
    this.currentBranch.timing.schedules.splice(index, 1);
    this.showNotification('Timing schedule block removed.');
  }

  zoomMap(delta: number) {
    this.mapZoom = Math.max(10, Math.min(19, this.mapZoom + delta));
  }

  applySearchLocationPreset(locationPreset: string) {
    if (locationPreset === 'wapda') {
      this.currentBranch.address.searchLocation = 'Wapda Town, Lahore, Punjab, Pakistan';
      this.currentBranch.address.latitude = 31.419919499059;
      this.currentBranch.address.longitude = 74.2658053087;
      this.currentBranch.address.area = 'Wapda Town';
      this.currentBranch.address.postalCode = '54770';
    } else if (locationPreset === 'valencia') {
      this.currentBranch.address.searchLocation = 'Valencia Town, Lahore, Punjab, Pakistan';
      this.currentBranch.address.latitude = 31.4012;
      this.currentBranch.address.longitude = 74.2534;
      this.currentBranch.address.area = 'Valencia Town';
      this.currentBranch.address.postalCode = '54770';
    } else if (locationPreset === 'clifton') {
      this.currentBranch.address.searchLocation = 'Clifton Block 2, Karachi, Sindh, Pakistan';
      this.currentBranch.address.latitude = 24.8138;
      this.currentBranch.address.longitude = 67.0300;
      this.currentBranch.address.area = 'Clifton';
      this.currentBranch.address.postalCode = '75600';
    } else if (locationPreset === 'gulshan') {
      this.currentBranch.address.searchLocation = 'Gulshan-e-Iqbal Block 13-D, Karachi, Sindh, Pakistan';
      this.currentBranch.address.latitude = 24.9207;
      this.currentBranch.address.longitude = 67.0935;
      this.currentBranch.address.area = 'Gulshan-e-Iqbal';
      this.currentBranch.address.postalCode = '75300';
    }
    this.showNotification(`Map coordinates updated for ${this.currentBranch.address.area}`);
  }

  saveBranchSettings() {
    if (this.currentBranch.settings.applyToAllBranches) {
      for (const b of this.branches) {
        b.settings.waiveOffLimit = this.currentBranch.settings.waiveOffLimit;
        b.settings.standardDeliveryFee = this.currentBranch.settings.standardDeliveryFee;
        b.settings.asapOnly = this.currentBranch.settings.asapOnly;
        b.settings.preOrderOnly = this.currentBranch.settings.preOrderOnly;
      }
      void showSaveSuccess(`Settings saved for ${this.currentBranch.name} and delivery thresholds synced across all ${this.branches.length} branches.`);
    } else {
      void showSaveSuccess(`Branch parameters and timings saved successfully for ${this.currentBranch.name}.`);
    }
  }

  showNotification(msg: string) {
    this.actionFeedback = msg;
    setTimeout(() => {
      this.actionFeedback = null;
    }, 4500);
  }
}
