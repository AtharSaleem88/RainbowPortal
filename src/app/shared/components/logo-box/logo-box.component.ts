import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo-box',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div [class]="className">
      <a routerLink="/" class="logo-dark">
        @if (size) {
          <img src="assets/images/logo-dark.png" class="logo-sm" alt="Rainbow Portal" />
          <img
            src="assets/images/logo-dark.png"
            class="logo-lg"
            alt="Rainbow Portal"
          />
        } @else {
          <img src="assets/images/logo-dark.png" height="42" style="max-height: 42px; width: auto; object-fit: contain;" alt="Rainbow Portal" />
        }
      </a>

      <a routerLink="/" class="logo-light">
        @if (size) {
          <img src="assets/images/logo-light.png" class="logo-sm" alt="Rainbow Portal" />
          <img
            src="assets/images/logo-light.png"
            class="logo-lg"
            alt="Rainbow Portal"
          />
        } @else {
          <img
            src="assets/images/logo-light.png"
            height="42"
            style="max-height: 42px; width: auto; object-fit: contain;"
            alt="Rainbow Portal"
          />
        }
      </a>
    </div>
  `,
})
export class LogoBoxComponent {
  @Input() className: string = '';
  @Input() size: boolean = false;
}
export { LogoBoxComponent as LogoBox };
