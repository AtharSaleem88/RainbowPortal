import { findAllParent, findMenuItem } from '@shared/utils/utils';
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { basePath } from '@common/constants';
import { MENU, type MenuItem } from '@common/menu-meta';
import { LogoBoxComponent } from '@shared/components';
import {
  NgbCollapseModule,
  type NgbCollapse,
} from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { changesidebarsize } from '@store/layout/layout-action';
import { getSidebarsize } from '@store/layout/layout-selector';
import { SimplebarAngularModule } from 'simplebar-angular';

import { AuthenticationService } from '@core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LogoBoxComponent,
    NgbCollapseModule,
    SimplebarAngularModule,
  ],
  templateUrl: './sidebar.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SidebarComponent {
  menuItems: MenuItem[] = [];
  activeMenuItems: string[] = [];

  router = inject(Router);
  trimmedURL = this.router.url?.replaceAll(
    basePath !== '' ? basePath + '/' : '',
    '/',
  );

  store = inject(Store);
  authService = inject(AuthenticationService);

  constructor() {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.trimmedURL = this.router.url?.replaceAll(
          basePath !== '' ? basePath + '/' : '',
          '/',
        );
        this._activateMenu();
        setTimeout(() => {
          this.scrollToActive();
        }, 200);
      }
    });
  }

  ngOnInit(): void {
    this.initMenu();
    this.authService.currentUser$.subscribe((user: any) => {
      this.initMenu();
      setTimeout(() => {
        this._activateMenu();
      }, 100);
    });
  }

  initMenu(): void {
    this.menuItems = this.filterMenuByRole(this.authService.user?.role);
  }

  filterMenuByRole(role?: string): MenuItem[] {
    const currentRole = role || 'Admin';
    const filtered: MenuItem[] = [];

    for (let i = 0; i < MENU.length; i++) {
      const item = MENU[i];

      // Check role restriction
      if (item.roles && !item.roles.includes(currentRole as any)) {
        continue;
      }

      if (item.isTitle) {
        // Only include title if there is at least one visible child item before the next title
        let hasVisibleChild = false;
        for (let j = i + 1; j < MENU.length; j++) {
          if (MENU[j].isTitle) break;
          if (!MENU[j].roles || MENU[j].roles?.includes(currentRole as any)) {
            hasVisibleChild = true;
            break;
          }
        }
        if (hasVisibleChild) {
          filtered.push({ ...item });
        }
      } else {
        if (item.subMenu && item.subMenu.length > 0) {
          const visibleSub = item.subMenu.filter((sub: MenuItem) =>
            !sub.roles || sub.roles.includes(currentRole as any)
          );
          if (visibleSub.length > 0) {
            filtered.push({ ...item, subMenu: visibleSub });
          }
        } else {
          filtered.push({ ...item });
        }
      }
    }

    return filtered;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this._activateMenu();
    });
    setTimeout(() => {
      this.scrollToActive();
    }, 200);
  }

  scrollToActive(): void {
    const activatedItem = document.querySelector('.nav-item li a.active');
    if (activatedItem) {
      const simplebarContent = document.querySelector(
        '.main-nav .simplebar-content-wrapper',
      );
      if (simplebarContent) {
        const activatedItemRect = activatedItem.getBoundingClientRect();
        const simplebarContentRect = simplebarContent.getBoundingClientRect();
        const activatedItemOffsetTop =
          activatedItemRect.top + simplebarContent.scrollTop;
        const centerOffset =
          activatedItemOffsetTop -
          simplebarContentRect.top -
          simplebarContent.clientHeight / 2 +
          activatedItemRect.height / 2;
        this.scrollTo(simplebarContent, centerOffset, 600);
      }
    }
  }

  easeInOutQuad(t: number, b: number, c: number, d: number): number {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  scrollTo(element: Element, to: number, duration: number): void {
    const start = element.scrollTop;
    const change = to - start;
    const increment = 20;
    let currentTime = 0;

    const animateScroll = () => {
      currentTime += increment;
      const val = this.easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  }

  _activateMenu(): void {
    const rawUrl = this.router.url || '';
    const cleanUrl = rawUrl.split('?')[0].split('#')[0];

    // Recursive search across menu items and sub-menus by route link
    let activeItem: MenuItem | null = null;

    const findActiveByRoute = (items: MenuItem[]): MenuItem | null => {
      for (const item of items) {
        if (item.link) {
          if (
            item.link === cleanUrl ||
            (cleanUrl === '/index' && item.link === '/index') ||
            (cleanUrl === '/' && item.link === '/index') ||
            (cleanUrl.startsWith('/category/add') && item.link === '/category/list') ||
            (cleanUrl.startsWith('/category/edit') && item.link === '/category/list') ||
            (cleanUrl.startsWith('/product/') && item.link === '/product/list') ||
            (cleanUrl.startsWith('/invoice/') && item.link === '/orders/list')
          ) {
            return item;
          }
        }
        if (item.subMenu && item.subMenu.length > 0) {
          const found = findActiveByRoute(item.subMenu);
          if (found) return found;
        }
      }
      return null;
    };

    activeItem = findActiveByRoute(this.menuItems);

    // Fallback: check DOM elements by pathname
    if (!activeItem) {
      const div = document.querySelector('.navbar-nav');
      if (div) {
        const items: any = div.getElementsByClassName('nav-link-ref');
        for (let i = 0; i < items.length; ++i) {
          if (cleanUrl === items[i].pathname) {
            const mid = items[i].getAttribute('aria-controls');
            activeItem = findMenuItem(this.menuItems, mid);
            if (activeItem) break;
          }
        }
      }
    }

    if (activeItem) {
      const matchingObjs = [
        activeItem['key']!,
        ...findAllParent(this.menuItems, activeItem),
      ];

      this.activeMenuItems = matchingObjs;
      this.menuItems.forEach((menu: MenuItem) => {
        if (menu.subMenu) {
          menu.collapsed = !matchingObjs.includes(menu.key!);
        }
      });
    }
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasSubmenu(menu: MenuItem): boolean {
    return menu.subMenu ? true : false;
  }

  /**
   * toggles open menu
   * @param menuItem clicked menuitem
   * @param collapse collpase instance
   */
  toggleMenuItem(menuItem: MenuItem, collapse: NgbCollapse): void {
    collapse.toggle();
    let openMenuItems: string[];
    if (!menuItem.collapsed) {
      openMenuItems = [
        menuItem['key'],
        ...findAllParent(this.menuItems, menuItem),
      ];
      this.menuItems.forEach((menu: MenuItem) => {
        if (!openMenuItems.includes(menu.key!)) {
          menu.collapsed = true;
        }
      });
    }
  }

  changeSidebarSize() {
    const currentSize = document.documentElement.getAttribute('data-menu-size');
    const newSize = (currentSize === 'condensed' || currentSize === 'sm-hover') ? 'default' : 'condensed';
    this.store.dispatch(changesidebarsize({ size: newSize }));
    document.documentElement.setAttribute('data-menu-size', newSize);
    document.documentElement.setAttribute('data-sidenav-size', newSize);
  }
}
export { SidebarComponent as Sidebar };
