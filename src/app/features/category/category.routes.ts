import { Route } from '@angular/router';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { CategoryAddComponent } from './category-add/category-add.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { SubSubCategoryComponent } from './sub-sub-category/sub-sub-category.component';
import { BrandsComponent } from './brands/brands.component';

export const CATEGORY_ROUTES: Route[] = [
  {
    path: 'list',
    component: CategoryListComponent,
    data: { title: 'Master Categories' },
  },
  {
    path: 'sub-category',
    component: SubCategoryComponent,
    data: { title: 'Sub Categories' },
  },
  {
    path: 'sub-sub-category',
    component: SubSubCategoryComponent,
    data: { title: 'Sub-Sub Categories & Tags' },
  },
  {
    path: 'brands',
    component: BrandsComponent,
    data: { title: 'Supermarket Brands' },
  },
  {
    path: 'edit',
    component: CategoryEditComponent,
    data: { title: 'Category Edit' },
  },
  {
    path: 'add',
    component: CategoryAddComponent,
    data: { title: 'Create Category' },
  },
];

export const CATEGORIES_ROUTES = CATEGORY_ROUTES;
