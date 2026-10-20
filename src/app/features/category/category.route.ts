import { Route } from '@angular/router'
import { CategoryList } from './category-list/category-list'
import { CategoryEdit } from './category-edit/category-edit'
import { CategoryAdd } from './category-add/category-add'
import { SubCategoryList } from './sub-category/sub-category'
import { SubSubCategoryList } from './sub-sub-category/sub-sub-category'
import { BrandList } from './brands/brands'

export const CATEGORY_ROUTES: Route[] = [
  {
    path: 'list',
    component: CategoryList,
    data: { title: 'Master Categories' },
  },
  {
    path: 'sub-category',
    component: SubCategoryList,
    data: { title: 'Sub Categories' },
  },
  {
    path: 'sub-sub-category',
    component: SubSubCategoryList,
    data: { title: 'Sub-Sub Categories & Tags' },
  },
  {
    path: 'brands',
    component: BrandList,
    data: { title: 'Supermarket Brands' },
  },
  {
    path: 'edit',
    component: CategoryEdit,
    data: { title: 'Category Edit' },
  },
  {
    path: 'add',
    component: CategoryAdd,
    data: { title: 'Create Category' },
  },
]
