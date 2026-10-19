import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SmsCampaign, MOCK_SMS_CAMPAIGNS } from '../data';
import { RainbowCustomer, RAINBOW_CUSTOMERS_LIST } from '../../customer/customer-list/data';
import { RAINBOW_BRANCH_OPTIONS, BranchOption } from '../../promotions/data';

@Component({
  selector: 'app-marketing-sms',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, RouterModule, NgbModalModule],
  templateUrl: './sms.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MarketingSms implements OnInit {
  title = 'Supermarket SMS Marketing Blast';
  campaigns: SmsCampaign[] = MOCK_SMS_CAMPAIGNS;
  branches: BranchOption[] = RAINBOW_BRANCH_OPTIONS;
  customers: RainbowCustomer[] = RAINBOW_CUSTOMERS_LIST;

  // Composer Form
  formTitle: string = 'Weekend Produce Super Savers';
  formMasking: string = 'RAINBOW';
  formMessage: string = 'RAINBOW: Flat 20% off on fresh chicken, fruits & dairy this weekend at Valencia Branch! Visit or order online at rainbow.pk. Helpline: 042-111-724-626';
  formTargetType: 'all' | 'branch' | 'segment' | 'individual' = 'branch';
  formTargetBranch: string = 'Rainbow Cash & Carry - Valencia, Lahore';
  formTargetCustomerId: string = 'CUST-1001';

  actionFeedback: string | null = null;

  constructor() {}

  ngOnInit(): void {}

  get smsCharacterCount(): number {
    return this.formMessage.length;
  }

  get smsCreditsCount(): number {
    return Math.ceil(Math.max(1, this.formMessage.length) / 160);
  }

  get estimatedRecipients(): number {
    if (this.formTargetType === 'all') return 30278;
    if (this.formTargetType === 'individual') return 1;
    if (this.formTargetType === 'branch') return 4850;
    return 10804;
  }

  sendSmsBlast() {
    if (!this.formTitle.trim()) {
      alert('Please enter a campaign name.');
      return;
    }
    if (!this.formMessage.trim()) {
      alert('Please enter an SMS message body.');
      return;
    }

    const campaign: SmsCampaign = {
      id: `SMS-${Date.now().toString().slice(-3)}`,
      title: this.formTitle,
      masking: this.formMasking || 'RAINBOW',
      message: this.formMessage,
      targetType: this.formTargetType,
      targetDetail: this.formTargetType === 'branch' ? this.formTargetBranch : (this.formTargetType === 'all' ? 'All Registered Shoppers' : 'Jamal (+923009496195)'),
      recipientsCount: this.estimatedRecipients,
      sentAt: new Date().toLocaleString(),
      status: 'Delivered',
      deliveryRate: 98.6,
    };

    this.campaigns.unshift(campaign);
    this.showNotification(`SMS Campaign "${campaign.title}" dispatched to ${campaign.recipientsCount} customers via masking ${campaign.masking}!`);
  }

  showNotification(msg: string) {
    this.actionFeedback = msg;
    setTimeout(() => {
      this.actionFeedback = null;
    }, 4500);
  }
}
