import { showSaveSuccess, showSaveValidation } from '@shared/utils/save-alert';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MASTER_CATEGORIES, MasterCategory } from '../data';

@Component({
  selector: 'app-category-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './category-add.component.html',
  styles: [`
    .modal-body {
      max-height: calc(100dvh - 160px);
      overflow-y: auto;
    }
    .cat-form-card {
      background: #ffffff;
      border: 1px solid #eaedf1;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
    }
    .cursor-pointer {
      cursor: pointer;
    }
    .font-jost {
      font-family: 'Jost', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .preview-box {
      border: 1px dashed #cbd5e1;
      border-radius: 10px;
      padding: 16px;
      background: #f8fafc;
    }
  `]
})
export class CategoryAddComponent {
  title = 'Create Master Category';
  private router = inject(Router);
  activeModal = inject(NgbActiveModal, { optional: true });
  saving = false;

  cancel(): void {
    if (this.activeModal) {
      this.activeModal.dismiss();
    } else {
      void this.router.navigate(['/category/list']);
    }
  }

  category: Partial<MasterCategory> = {
    id: `CAT-${(MASTER_CATEGORIES.length + 1).toString().padStart(2, '0')}`,
    name: '',
    slug: '',
    skuPrefix: '',
    description: '',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80',
    icon: 'solar:box-minimalistic-bold-duotone',
    subCategoryCount: 0,
    totalProducts: 0,
    createdBy: 'Admin'
  };

  onNameChange(): void {
    if (this.category.name) {
      // Auto-generate slug
      this.category.slug = this.category.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Auto-generate prefix if empty
      if (!this.category.skuPrefix) {
        const words = this.category.name.trim().split(/\s+/);
        if (words.length >= 2) {
          this.category.skuPrefix = words.map(w => w[0]).join('').toUpperCase().slice(0, 4);
        } else {
          this.category.skuPrefix = this.category.name.slice(0, 3).toUpperCase();
        }
      }
    }
  }

  async saveCategory(): Promise<void> {
    if (this.saving) return;
    if (!this.category.name?.trim()) {
      void showSaveValidation('Please fill in Category Title.');
      return;
    }

    const words = this.category.name.trim().split(/\s+/);
    const generatedPrefix = words.length >= 2 
      ? words.map(w => w[0]).join('').toUpperCase().slice(0, 4) 
      : this.category.name.slice(0, 3).toUpperCase();

    const newCat: MasterCategory = {
      id: this.category.id || `CAT-${(MASTER_CATEGORIES.length + 1).toString().padStart(2, '0')}`,
      name: this.category.name,
      slug: this.category.slug || this.category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      skuPrefix: (this.category.skuPrefix || generatedPrefix).toUpperCase(),
      description: this.category.description || 'Master supermarket department.',
      status: this.category.status as 'Active' | 'Inactive',
      image: this.category.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80',
      icon: 'solar:box-minimalistic-bold-duotone',
      subCategoryCount: 0,
      totalProducts: 0,
      createdBy: 'Admin'
    };

    this.saving = true;
    MASTER_CATEGORIES.unshift(newCat);
    if (this.activeModal) {
      this.activeModal.close(newCat);
      await showSaveSuccess('Master category saved successfully.');
      return;
    }
    await showSaveSuccess('Master category saved successfully.');
    this.router.navigate(['/category/list']);
  }
}

export { CategoryAddComponent as CategoryAdd };
