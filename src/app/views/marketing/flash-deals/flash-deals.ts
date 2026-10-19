import { showSaveSuccess, showSaveValidation } from '@/app/helper/save-alert';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FlashDeal, MOCK_FLASH_DEALS } from '../data';
import { RAINBOW_BRANCH_OPTIONS, BranchOption } from '../../promotions/data';

@Component({
  selector: 'app-flash-deals',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, RouterModule, NgbModalModule],
  templateUrl: './flash-deals.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MarketingFlashDeals implements OnInit {
  title = 'Flash Sales & Super Savers';
  deals: FlashDeal[] = MOCK_FLASH_DEALS;
  branches: BranchOption[] = RAINBOW_BRANCH_OPTIONS;

  filterBranch: string = 'all';
  filterStatus: string = 'all';
  searchTerm: string = '';

  newDeal: Partial<FlashDeal> = {
    title: '',
    subtitle: '',
    badge: 'FLAT 25% OFF',
    discountPercentage: 25,
    branch: 'All Branches',
    startTime: '2026-10-18 09:00 AM',
    endTime: '2026-10-18 09:00 PM',
    productsCount: 30,
    bannerImage: 'assets/images/products/product-1(1).png',
    status: 'Upcoming',
  };

  actionFeedback: string | null = null;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  get filteredDeals(): FlashDeal[] {
    return this.deals.filter(d => {
      if (this.filterBranch !== 'all' && !d.branch.includes(this.filterBranch) && d.branch !== 'All Branches') return false;
      if (this.filterStatus !== 'all' && d.status !== this.filterStatus) return false;
      if (this.searchTerm.trim()) {
        const q = this.searchTerm.toLowerCase();
        if (!d.title.toLowerCase().includes(q) && !d.subtitle.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }

  get totalOrdersGenerated(): number {
    return this.deals.reduce((sum, d) => sum + d.ordersGenerated, 0);
  }

  get totalRevenueGenerated(): number {
    return this.deals.reduce((sum, d) => sum + d.revenueGenerated, 0);
  }

  openCreateModal(content: any) {
    this.newDeal = {
      title: '',
      subtitle: '',
      badge: 'FLAT 20% OFF',
      discountPercentage: 20,
      branch: 'All Branches',
      startTime: '2026-10-18 08:00 AM',
      endTime: '2026-10-18 10:00 PM',
      productsCount: 25,
      bannerImage: 'assets/images/products/product-2.png',
      status: 'Upcoming',
    };
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  saveDeal(modal: any) {
    if (!this.newDeal.title?.trim()) {
      void showSaveValidation('Please enter a flash deal title.');
      return;
    }

    const deal: FlashDeal = {
      id: `FD-${Date.now().toString().slice(-3)}`,
      title: this.newDeal.title!,
      subtitle: this.newDeal.subtitle || 'Special Limited-Time Grocery Rush Deal',
      badge: this.newDeal.badge || `${this.newDeal.discountPercentage}% OFF`,
      discountPercentage: Number(this.newDeal.discountPercentage) || 20,
      branch: this.newDeal.branch || 'All Branches',
      startTime: this.newDeal.startTime || '2026-10-18 08:00 AM',
      endTime: this.newDeal.endTime || '2026-10-18 10:00 PM',
      productsCount: Number(this.newDeal.productsCount) || 20,
      bannerImage: this.newDeal.bannerImage || 'assets/images/products/product-1(1).png',
      status: 'Upcoming',
      ordersGenerated: 0,
      revenueGenerated: 0,
    };

    this.deals.unshift(deal);
    void showSaveSuccess(`Flash Deal "${deal.title}" created successfully!`);
    modal.close();
  }

  toggleLiveStatus(deal: FlashDeal) {
    deal.status = deal.status === 'Live' ? 'Ended' : 'Live';
    this.showNotification(`Deal "${deal.title}" marked as ${deal.status}.`);
  }

  showNotification(msg: string) {
    this.actionFeedback = msg;
    setTimeout(() => {
      this.actionFeedback = null;
    }, 4500);
  }
}
