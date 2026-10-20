# Rainbow Portal - Enterprise Angular Architecture & Developer Guide

## 1. Architectural Philosophy & Overview

Rainbow Portal is built on **Angular 21** with **Standalone Components**, utilizing clean separation of concerns, strict TypeScript typings, and reusable component-based patterns.

This guide outlines our architectural standards to ensure every new module, page, and feature is consistent, maintainable, and adheres to the established design system.

```
src/
├── app/
│   ├── core/                  # Core singletons, services, guards, interceptors
│   ├── layouts/               # Admin layout shell, header, sidebar, navigation
│   │   ├── sidebar/           # Sidebar menu navigation & menu items
│   │   └── ...
│   ├── shared/                # Global shared components, directives, pipes, models
│   └── views/                 # Domain Feature Modules
│       ├── products/          # Products Catalog & Management
│       ├── category/          # Categories, Sub-categories, Brands
│       ├── orders/            # Orders, Returns, Feedback
│       ├── customer/          # Customer Directory & CRM
│       ├── coupons/           # Promotional Discount Codes & Vouchers
│       ├── marketing/         # Banners, Loyalty Points, Wallets, Notifications
│       ├── promotions/        # Campaign Bundles & Promotions
│       ├── roles/             # Staff, Access Control, Role Matrix
│       ├── inventory/         # Stock levels, Warehouse sync
│       └── ...
└── styles.scss                # Global Design System tokens & utility classes
```

---

## 2. Directory & Component Structure per Feature Module

Whenever creating or refactoring a feature module (e.g., `inventory`), use the following structure:

```
src/app/views/[module-name]/
├── [feature-name]/
│   ├── [feature-name].ts             # Smart/Container Component logic & state
│   ├── [feature-name].html           # View template
│   ├── [feature-name].scss           # Scoped styling (if needed beyond global classes)
│   └── components/                   # Reusable Presentational Subcomponents
│       ├── [feature]-metrics/        # Executive KPI Cards subcomponent
│       │   ├── [feature]-metrics.ts
│       │   ├── [feature]-metrics.html
│       │   └── [feature]-metrics.scss
│       ├── [feature]-table/          # (Optional) Reusable data table
│       └── [feature]-filter/         # (Optional) Filter toolbar
├── services/                         # (Optional) Module-specific state or API service
├── models/                           # (Optional) Domain interfaces / data types
└── [module-name].routes.ts           # Feature-level lazy routes
```

### Key Principles:
1. **Separation of Files**: Never put large inline templates or styles inside `.ts` files. Always use `templateUrl` and `styleUrls` (or `styleUrl`).
2. **Presentational (Dumb) Subcomponents**: Extract KPI metric cards, filters, tables, and modal contents into subcomponents with typed `@Input()` properties and `@Output()` event emitters.
3. **Smart (Container) Components**: Keep page-level components responsible for data fetching, state management, search/filter algorithms, and modal orchestration.

---

## 3. Standard Design System & Global CSS Classes

All standard enterprise admin UI elements are defined in `src/styles.scss`. Always use these utility classes instead of creating one-off custom CSS:

### A. Main Container Card
```html
<div class="cat-main-card overflow-hidden mb-4">
  <!-- Header Toolbar -->
  <div class="p-3 border-bottom bg-white">
    ...
  </div>
  <!-- Table Container -->
  <div class="table-responsive">
    <table class="table table-hover table-clean align-middle mb-0">
      ...
    </table>
  </div>
</div>
```

### B. Executive KPI Metrics Cards
Extract into a dedicated `*-metrics` subcomponent. Each card should use:
```html
<div class="row g-3 mb-3">
  <div class="col-6 col-lg-3">
    <div class="cat-metric-card">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <span class="fs-12 fw-bold text-uppercase text-muted" style="letter-spacing: 0.5px;">Metric Title</span>
        <div class="cat-metric-icon bg-primary-subtle text-primary">
          <iconify-icon icon="solar:wallet-bold-duotone"></iconify-icon>
        </div>
      </div>
      <div class="fs-22 fw-bold text-dark font-jost mb-0">{{ count }}</div>
      <small class="text-muted fs-11">Helpful contextual hint</small>
    </div>
  </div>
</div>
```

Metric Icon Color Variants:
- `bg-primary-subtle text-primary`
- `bg-success-subtle text-success`
- `bg-info-subtle text-info`
- `bg-warning-subtle text-warning`
- `bg-danger-subtle text-danger`

### C. Filter Segmented Controls
Used in list headers for status tab switching:
```html
<div class="filter-segmented-control">
  <button type="button" class="segment-btn" [class.active]="selectedTab === 'all'" (click)="setTab('all')">
    <span>All</span>
    <span class="count-pill">{{ totalCount }}</span>
  </button>
  <button type="button" class="segment-btn" [class.active]="selectedTab === 'active'" (click)="setTab('active')">
    <span>Active</span>
    <span class="count-pill">{{ activeCount }}</span>
  </button>
</div>
```

### D. Search Box & Filter Bar
```html
<div class="search-box-wrapper flex-grow-1" style="max-width: 320px;">
  <iconify-icon icon="solar:magnifer-linear" class="search-icon"></iconify-icon>
  <input type="text" class="form-control form-control-sm search-input" placeholder="Search records..." [(ngModel)]="searchTerm" (ngModelChange)="onSearchChange()">
  @if (searchTerm) {
    <button type="button" class="btn-clear-search" (click)="searchTerm = ''; onSearchChange()">
      <iconify-icon icon="solar:close-circle-bold"></iconify-icon>
    </button>
  }
</div>
```

### E. Standard Tables
```html
<table class="table table-hover table-clean align-middle mb-0">
  <thead class="bg-light">
    <tr>
      <th style="width: 40px;"><input type="checkbox" class="form-check-input" ...></th>
      <th>Item Name</th>
      <th>Category</th>
      <th>Status</th>
      <th class="text-end">Actions</th>
    </tr>
  </thead>
  <tbody>
    @for (item of paginatedItems; track item.id) {
      <tr>
        <td><input type="checkbox" class="form-check-input" ...></td>
        <td class="fw-semibold text-dark">{{ item.name }}</td>
        <td>{{ item.category }}</td>
        <td>
          <span class="badge" [ngClass]="item.isActive ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'">
            {{ item.isActive ? 'Active' : 'Inactive' }}
          </span>
        </td>
        <td class="text-end">
          <div class="d-inline-flex align-items-center gap-1">
            <button type="button" class="cat-action-btn edit" (click)="openEdit(item)" title="Edit">
              <iconify-icon icon="solar:pen-new-square-linear"></iconify-icon>
            </button>
            <button type="button" class="cat-action-btn delete" (click)="deleteItem(item)" title="Delete">
              <iconify-icon icon="solar:trash-bin-trash-linear"></iconify-icon>
            </button>
          </div>
        </td>
      </tr>
    }
  </tbody>
</table>
```

### F. Uniform Modal Standards
All modals across the portal strictly follow these rules:
1. **Title Only**: Clean modal header with only the title (NO icon before title, NO subtitles, NO description lines).
2. **Buttons**: Use `.btn-modal-cancel` for dismissal and `.btn-modal-primary` for action/save.
3. **Layout**:
```html
<ng-template #itemModal let-modal>
  <div class="modal-header border-0 pb-0 pt-3 px-4">
    <h5 class="modal-title fw-bold text-dark fs-16 mb-0">{{ isEdit ? 'Edit Item' : 'Add New Item' }}</h5>
    <button type="button" class="btn-close fs-11" (click)="modal.dismiss()"></button>
  </div>
  <div class="modal-body px-4 py-3">
    <!-- Form fields -->
  </div>
  <div class="modal-footer border-0 pt-0 pb-3 px-4 d-flex justify-content-end gap-2">
    <button type="button" class="btn btn-sm btn-modal-cancel px-3 py-1.5" (click)="modal.dismiss()">Cancel</button>
    <button type="button" class="btn btn-sm btn-modal-primary px-3 py-1.5" (click)="saveItem()">
      {{ isEdit ? 'Save Changes' : 'Create Item' }}
    </button>
  </div>
</ng-template>
```

---

## 4. Step-by-Step: Adding a New Feature Module

### Step 1: Create the Feature Component & Subcomponents
Generate the files in `src/app/views/[module-name]/[feature-name]/`:
- Component `.ts`, `.html`, `.scss`
- Subcomponent `components/[feature-name]-metrics/`

### Step 2: Configure Route Definition
In `src/app/views/[module-name]/[module-name].route.ts`:
```typescript
import { Routes } from '@angular/router';

export const MODULE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./[feature-name]/[feature-name]').then(m => m.[FeatureName]Component),
    data: { title: 'Feature List' }
  }
];
```

### Step 3: Register in Views Routing
In `src/app/views/views.route.ts`:
```typescript
{
  path: '[module-name]',
  loadChildren: () => import('./[module-name]/[module-name].route').then(m => m.MODULE_ROUTES)
}
```

### Step 4: Add Navigation to Sidebar
In `src/app/layouts/sidebar/menu.ts` (or the sidebar navigation data model):
Add the menu entry with title, routerLink, and iconify solar icon.

---

## 5. Verification Checklist for New Features
- [ ] No inline CSS in `.ts` files — all custom styles in `.scss`.
- [ ] Reusable metrics cards extracted into dedicated `*-metrics` subcomponent.
- [ ] Universal modal styling applied (no title icon, no subtitle, `.btn-modal-cancel` + `.btn-modal-primary`).
- [ ] No duplicate or dead code.
- [ ] Fully responsive on desktop, tablet, and mobile breakpoints.
- [ ] Runs cleanly with `npm run build` (0 compilation errors, 0 template errors).
