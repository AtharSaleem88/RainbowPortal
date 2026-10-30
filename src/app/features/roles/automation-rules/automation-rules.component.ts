import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WorkflowConfigService } from '@core/services/workflow-config.service';
import { AuthenticationService } from '@core/services/auth.service';
import { BranchAutomationRule, RainbowBranch } from '@core/models/workflow.model';
import { showSaveSuccess, showSaveValidation } from '@shared/utils/save-alert';
import { ThemedNativeSelectDirective } from '../../products/themed-select/themed-native-select.directive';

@Component({
  selector: 'app-automation-rules',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ThemedNativeSelectDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './automation-rules.component.html',
  styles: [`
    .font-jost { font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif; }
    .cat-main-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
      background: #ffffff;
    }
    .form-control-sleek {
      border: 1px solid #cbd5e1;
      border-radius: 7px;
      font-size: 13px;
      padding: 6px 12px;
      &:focus {
        border-color: #2e3192;
        box-shadow: 0 0 0 3px rgba(46, 49, 146, 0.1);
      }
    }
    .rule-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 16px 18px;
      height: 100%;
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
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
  `]
})
export class AutomationRulesComponent implements OnInit {
  configService = inject(WorkflowConfigService);
  authService = inject(AuthenticationService);
  currentUser = this.authService.user;

  branches: RainbowBranch[] = [];
  selectedBranchCode: string = 'VAL-01';
  rule!: BranchAutomationRule;

  feedbackMessage: string | null = null;
  feedbackType: 'success' | 'warning' = 'success';

  ngOnInit(): void {
    this.branches = this.configService.branches;
    this.configService.branches$.subscribe(bList => {
      this.branches = bList;
      if (!this.selectedBranchCode && bList.length > 0) {
        this.selectedBranchCode = bList[0].branchCode;
      }
    });

    if (this.currentUser?.role === 'Branch Manager') {
      this.selectedBranchCode = this.currentUser.branchCode || 'VAL-01';
    }

    this.loadRuleForSelectedBranch();
  }

  get isBranchLocked(): boolean {
    return this.currentUser?.role === 'Branch Manager';
  }

  get selectedBranch(): RainbowBranch | undefined {
    return this.branches.find(b => b.branchCode === this.selectedBranchCode);
  }

  onSelectBranch(code: string): void {
    this.selectedBranchCode = code;
    this.loadRuleForSelectedBranch();
  }

  loadRuleForSelectedBranch(): void {
    const r = this.configService.getBranchRule(this.selectedBranchCode);
    this.rule = JSON.parse(JSON.stringify(r));
  }

  saveRules(): void {
    if (!this.rule) return;
    if (!this.rule.dispatcherMaxOrdersThreshold || this.rule.dispatcherMaxOrdersThreshold < 1) {
      void showSaveValidation('Dispatcher queue threshold must be at least 1 order.');
      return;
    }
    if (!this.rule.riderMaxOrdersThreshold || this.rule.riderMaxOrdersThreshold < 1) {
      void showSaveValidation('Rider delivery queue threshold must be at least 1 order.');
      return;
    }

    this.configService.saveBranchRule(this.rule, this.currentUser);
    this.showFeedback(`Queue automation rules for ${this.rule.branchName} saved successfully!`, 'success');
  }

  applyToAll(): void {
    if (!this.rule) return;
    this.configService.applyRuleToAllBranches(this.rule, this.currentUser);
    this.showFeedback(`Queue automation policy from ${this.rule.branchName} applied to all retail superstores!`, 'success');
  }

  reloadRules(): void {
    this.loadRuleForSelectedBranch();
    this.showFeedback('Queue automation rules reloaded.', 'success');
  }

  resetToDefault(): void {
    const branch = this.selectedBranch;
    this.rule = {
      branchCode: this.selectedBranchCode,
      branchName: branch?.name || 'Rainbow Superstore',
      city: branch?.city || 'Lahore',
      dispatcherMaxOrdersThreshold: 10,
      autoAssignDispatcherOnAccept: true,
      priorityDispatcherRouting: true,
      riderMaxOrdersThreshold: 3,
      autoAssignRiderOnReadyToPick: true,
      priorityRiderRouting: true,
      bmRefundLimitPkr: 1500,
      modRefundLimitPkr: 5000
    };
    this.showFeedback('Reset queue automation rules to standard company baseline.', 'warning');
  }

  private showFeedback(msg: string, type: 'success' | 'warning'): void {
    this.feedbackMessage = msg;
    this.feedbackType = type;
    void showSaveSuccess(msg);
    setTimeout(() => {
      this.feedbackMessage = null;
    }, 4500);
  }
}
