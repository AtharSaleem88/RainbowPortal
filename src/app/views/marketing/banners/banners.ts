import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MarketingBanner, MOCK_MARKETING_BANNERS } from '../data';
import { RAINBOW_BRANCH_OPTIONS, BranchOption } from '../../promotions/data';

@Component({
  selector: 'app-marketing-banners',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, RouterModule, NgbModalModule],
  templateUrl: './banners.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MarketingBanners implements OnInit {
  banners: MarketingBanner[] = MOCK_MARKETING_BANNERS;
  branches: BranchOption[] = RAINBOW_BRANCH_OPTIONS;

  selectedPlacement: string = 'all';
  selectedBranch: string = 'all';
  searchTerm: string = '';

  // New Banner Form
  newBanner: Partial<MarketingBanner> = {
    title: '',
    imageUrl: 'assets/images/small/img-1.jpg',
    placement: 'Home Carousel Slider',
    branch: 'All Branches',
    linkType: 'category',
    linkTarget: 'Fresh Produce',
    startDate: '2026-10-15',
    endDate: '2026-11-15',
    status: 'Active',
  };

  actionFeedback: string | null = null;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  get filteredBanners(): MarketingBanner[] {
    return this.banners.filter(b => {
      if (this.selectedPlacement !== 'all' && b.placement !== this.selectedPlacement) return false;
      if (this.selectedBranch !== 'all' && !b.branch.includes(this.selectedBranch) && b.branch !== 'All Branches') return false;
      if (this.searchTerm.trim()) {
        const q = this.searchTerm.toLowerCase();
        if (!b.title.toLowerCase().includes(q) && !b.linkTarget.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }

  get totalImpressions(): number {
    return this.banners.reduce((sum, b) => sum + b.impressions, 0);
  }

  get totalClicks(): number {
    return this.banners.reduce((sum, b) => sum + b.clicks, 0);
  }

  get averageCtr(): number {
    if (this.totalImpressions === 0) return 0;
    return Number(((this.totalClicks / this.totalImpressions) * 100).toFixed(2));
  }

  openAddModal(content: any) {
    this.newBanner = {
      title: '',
      imageUrl: 'assets/images/small/img-2.jpg',
      placement: 'Home Carousel Slider',
      branch: 'All Branches',
      linkType: 'category',
      linkTarget: 'Grocery & Staples',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '2026-11-30',
      status: 'Active',
    };
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  saveBanner(modal: any) {
    if (!this.newBanner.title?.trim()) {
      alert('Please enter a banner title.');
      return;
    }

    const banner: MarketingBanner = {
      id: `BAN-${Date.now().toString().slice(-3)}`,
      title: this.newBanner.title!,
      imageUrl: this.newBanner.imageUrl || 'assets/images/small/img-1.jpg',
      placement: this.newBanner.placement as any,
      branch: this.newBanner.branch || 'All Branches',
      linkType: this.newBanner.linkType as any,
      linkTarget: this.newBanner.linkTarget || 'Store',
      startDate: this.newBanner.startDate || '2026-10-15',
      endDate: this.newBanner.endDate || '2026-11-15',
      status: 'Active',
      impressions: 0,
      clicks: 0,
      ctr: 0,
    };

    this.banners.unshift(banner);
    this.showNotification(`Promotional banner "${banner.title}" created successfully!`);
    modal.close();
  }

  toggleBannerStatus(b: MarketingBanner) {
    b.status = b.status === 'Active' ? 'Paused' : 'Active';
    this.showNotification(`Banner "${b.title}" is now ${b.status}.`);
  }

  deleteBanner(b: MarketingBanner) {
    if (confirm(`Delete banner "${b.title}"?`)) {
      this.banners = this.banners.filter(x => x.id !== b.id);
      this.showNotification(`Banner removed.`);
    }
  }

  showNotification(msg: string) {
    this.actionFeedback = msg;
    setTimeout(() => {
      this.actionFeedback = null;
    }, 4500);
  }
}
