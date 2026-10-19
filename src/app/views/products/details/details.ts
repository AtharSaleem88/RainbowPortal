import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ItemDetail } from './components/item-detail/item-detail';
import { TopReview } from './components/top-review/top-review';
import { ProductInfo } from './components/product-info/product-info';
import { ProductImage } from './components/product-image/product-image';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    ProductImage,
    ItemDetail,
    TopReview,
    ProductInfo,
    RouterLink,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './details.html',
})
export class Details {
  title = 'PRODUCT DETAILS';
}
