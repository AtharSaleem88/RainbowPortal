import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MASTER_CATEGORIES, MasterCategory } from '../../../data';

@Component({
  selector: 'categories',
  standalone: true,
  imports: [CommonModule, DecimalPipe, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './categories.html',
  styles: [`
    .cat-metric-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
      background: #ffffff;
      padding: 16px 18px;
      height: 100%;
      text-decoration: none;
      color: inherit;
      display: block;
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
    .metric-label {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .metric-value {
      font-size: 22px;
    }
    .metric-subtext {
      font-size: 11px;
    }
    .font-jost {
      font-family: 'Jost', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    @media (max-width: 767.98px) {
      .cat-metric-card {
        padding: 9px 12px;
        border-radius: 9px;
      }
      .cat-metric-icon {
        width: 30px;
        height: 30px;
        border-radius: 7px;
        font-size: 16px;
      }
      .metric-label {
        font-size: 10.5px;
        letter-spacing: 0.3px;
      }
      .metric-value {
        font-size: 16px;
      }
    }
  `]
})
export class Categories {
  totalDepartments: number = MASTER_CATEGORIES.length;
  activeDepartments: number = MASTER_CATEGORIES.filter((c: MasterCategory) => c.status === 'Active').length;
  totalSubCategories: number = MASTER_CATEGORIES.reduce((acc: number, cat: MasterCategory) => acc + (cat.subCategoryCount || 0), 0);
  totalProducts: number = MASTER_CATEGORIES.reduce((acc: number, cat: MasterCategory) => acc + (cat.totalProducts || 0), 0);
  inStockSKUs: number = 3280;
  lowStockSKUs: number = 165;
}
