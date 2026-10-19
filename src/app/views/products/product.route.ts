import { Route } from '@angular/router'
import { List } from './list/list'
import { ManageProduct } from './manage-product/manage-product'

export const PRODUCT_ROUTES: Route[] = [
  {
    path: 'list',
    component: List,
    data: { title: 'Product Inventory & Stock' },
  },
  {
    path: 'manage',
    component: ManageProduct,
    data: { title: 'Manage Product' },
  },
  {
    path: 'add',
    component: ManageProduct,
    data: { title: 'Add Product' },
  },
  {
    path: 'edit',
    component: ManageProduct,
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
]
