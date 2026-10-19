import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MASTER_CATEGORIES, MasterCategory } from '../data';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './category-edit.html',
  styles: [`
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
export class CategoryEdit implements OnInit {
  title = 'Category Edit';
  private route = inject(ActivatedRoute);
  private router = inject(Router);

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

  saveCategory(): void {
    if (!this.category.name) {
      alert('Please fill in Category Title.');
      return;
    }

    const index = MASTER_CATEGORIES.findIndex(c => c.id === this.category.id);
    if (index !== -1) {
      MASTER_CATEGORIES[index] = { ...this.category };
    }

    this.router.navigate(['/category/list']);
  }
}
