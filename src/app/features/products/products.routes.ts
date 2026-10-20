import { Route } from '@angular/router';
import { ProductListComponent } from './list/product-list.component';
import { ManageProductComponent } from './manage-product/manage-product.component';

export const PRODUCT_ROUTES: Route[] = [
  {
    path: 'list',
    component: ProductListComponent,
    data: { title: 'Product Inventory & Stock' },
  },
  {
    path: 'manage',
    component: ManageProductComponent,
    data: { title: 'Manage Product' },
  },
  {
    path: 'add',
    component: ManageProductComponent,
    data: { title: 'Add Product' },
  },
  {
    path: 'edit',
    component: ManageProductComponent,
    data: { title: 'Edit Product' },
  },
  {
    path: 'details',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'grid',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];

export const PRODUCTS_ROUTES = PRODUCT_ROUTES;
