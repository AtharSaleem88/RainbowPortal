import { showSaveSuccess } from '@/app/helper/save-alert';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReferralConfig, MOCK_REFERRAL_CONFIG } from '../data';

@Component({
  selector: 'app-marketing-referrals',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, RouterModule],
  templateUrl: './referrals.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MarketingReferrals implements OnInit {
  title = 'Customer Referral & Loyalty Rewards';
  config: ReferralConfig = MOCK_REFERRAL_CONFIG;
  actionFeedback: string | null = null;

  constructor() {}

  ngOnInit(): void {}

  saveRules() {
    void showSaveSuccess('Referral & Reward rules updated successfully!');
  }

  toggleProgram() {
    this.config.isEnabled = !this.config.isEnabled;
    this.showNotification(`Referral program is now ${this.config.isEnabled ? 'Active' : 'Disabled'}.`);
  }

  showNotification(msg: string) {
    this.actionFeedback = msg;
    setTimeout(() => {
      this.actionFeedback = null;
    }, 4500);
  }
}
