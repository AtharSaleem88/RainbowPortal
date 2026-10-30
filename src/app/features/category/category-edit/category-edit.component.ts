import { showSaveSuccess, showSaveValidation } from '@shared/utils/save-alert';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MASTER_CATEGORIES, MasterCategory } from '../data';
import { ThemedSelectComponent, ThemedSelectOption } from '../../products/themed-select/themed-select.component';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ThemedSelectComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './category-edit.component.html',
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
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .preview-box {
      border: 1px dashed #cbd5e1;
      border-radius: 10px;
      padding: 16px;
      background: #f8fafc;
    }
  `]
})
export class CategoryEditComponent implements OnInit {
  statusOptions: ThemedSelectOption[] = [
    { value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' },
  ];
  title = 'Edit Master Category';
  private route = inject(ActivatedRoute);
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

  category: MasterCategory = {
    id: 'CAT-02',
    name: 'Dairy, Bread & Eggs',
    slug: 'dairy-bread-eggs',
    skuPrefix: 'DBE',
    description: 'Fresh milk, farm fresh eggs, artisan bread, butter, cheese and dairy essentials.',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=160&auto=format&fit=crop&q=80',
    icon: 'solar:cup-bold-duotone',
    subCategoryCount: 5,
    totalProducts: 342,
    createdBy: 'Admin'
  };

  ngOnInit(): void {
    if (this.activeModal) return;
    this.route.queryParams.subscribe(params => {
      const catId = params['id'];
      if (catId) {
        const found = MASTER_CATEGORIES.find(c => c.id === catId);
        if (found) {
          this.category = { ...found };
        }
      }
    });
  }

  async saveCategory(): Promise<void> {
    if (this.saving) return;
    if (!this.category.name?.trim()) {
      void showSaveValidation('Please fill in Category Title.');
      return;
    }

    const index = MASTER_CATEGORIES.findIndex(c => c.id === this.category.id);
    if (index === -1) {
      void showSaveValidation('This category could not be found. Please reopen it from the category list.');
      return;
    }
    this.saving = true;
    const updatedCategory = { ...this.category, name: this.category.name.trim() };
    MASTER_CATEGORIES[index] = updatedCategory;

    if (this.activeModal) {
      this.activeModal.close(updatedCategory);
      await showSaveSuccess('Master category saved successfully.');
      return;
    }

    await showSaveSuccess('Master category saved successfully.');
    this.router.navigate(['/category/list']);
  }
}

export { CategoryEditComponent as CategoryEdit };
