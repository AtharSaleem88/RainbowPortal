import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  NgbActiveOffcanvas,
  NgbDropdownModule,
  NgbOffcanvas,
  NgbOffcanvasModule,
} from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { SimplebarAngularModule } from 'simplebar-angular';
import { notificationsData } from './data';
import { logout } from '@store/authentication/authentication.actions';

import { AuthenticationService } from '@core/services/auth.service';
import { getUser } from '@store/authentication/authentication.selector';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NgbOffcanvasModule,
    SimplebarAngularModule,
    NgbDropdownModule,
  ],
  templateUrl: './topbar.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [NgbActiveOffcanvas],
})
export class TopbarComponent {
  @Input() title: string | undefined;
  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();

  router = inject(Router);
  store = inject(Store);
  offcanvasService = inject(NgbOffcanvas);
  authService = inject(AuthenticationService);

  currentUser: any = this.authService.user;
  notificationList = notificationsData;

  ngOnInit(): void {
    this.store.select(getUser).subscribe((user) => {
      if (user) {
        this.currentUser = user;
      }
    });

    this.authService.currentUser$.subscribe((user: any) => {
      if (user) {
        this.currentUser = user;
      }
    });
  }

  settingMenu() {
    this.settingsButtonClicked.emit();
  }

  toggleMobileMenu() {
    this.mobileMenuButtonClicked.emit();
  }

  logout() {
    this.store.dispatch(logout())
  }
}

export { TopbarComponent as Topbar };
