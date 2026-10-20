import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbCarouselModule, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'detail-product-image',
  standalone: true,
  imports: [NgbCarouselModule, CommonModule],
  templateUrl: './product-image.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductImage {
  activeSlide: number = 0;
  slides = [
    { 
      img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=700&auto=format&fit=crop&q=80', 
      thumb: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=150&auto=format&fit=crop&q=80' 
    },
    { 
      img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=700&auto=format&fit=crop&q=80', 
      thumb: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=150&auto=format&fit=crop&q=80' 
    },
    { 
      img: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=700&auto=format&fit=crop&q=80', 
      thumb: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=150&auto=format&fit=crop&q=80' 
    }
  ];

  constructor(config: NgbCarouselConfig) {
    config.interval = 3500;
    config.wrap = true;
    config.keyboard = true;
    config.pauseOnHover = true;
  }

  onSlideChange(event: any) {
    this.activeSlide = event.current;
  }
}
