import { Component, ChangeDetectorRef, inject, type OnInit } from '@angular/core';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import {
  changemenucolor,
  changesidebarsize,
  changetheme,
  changetopbarcolor,
  resetState,
} from '@store/layout/layout-action';
import {
  getLayoutColor,
  getMenucolor,
  getSidebarsize,
  getTopbarcolor,
} from '@store/layout/layout-selector';
import { SimplebarAngularModule } from 'simplebar-angular'

@Component({
  selector: 'app-rightsidebar',
  standalone: true,
  imports: [SimplebarAngularModule],
  templateUrl: './rightsidebar.html',
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class RightSidebar implements OnInit {
  offcanvas = inject(NgbActiveOffcanvas);
  store = inject(Store);
  private cdr = inject(ChangeDetectorRef);

  color: any = 'light';
  topbar: any = 'light';
  menuColor: any = 'dark';
  menuSize: any = 'default';

  ngOnInit(): void {
    this.color = document.documentElement.getAttribute('data-bs-theme') || 'light';
    this.topbar = document.documentElement.getAttribute('data-topbar-color') || 'light';
    this.menuColor = document.documentElement.getAttribute('data-menu-color') || 'dark';
    this.menuSize = document.documentElement.getAttribute('data-menu-size') || 'default';

    this.store.select('layout').subscribe((data: any) => {
      if (data) {
        this.color = data.LAYOUT_THEME || this.color;
        this.topbar = data.TOPBAR_COLOR || this.topbar;
        this.menuColor = data.MENU_COLOR || this.menuColor;
        this.menuSize = data.MENU_SIZE || this.menuSize;
        this.cdr.detectChanges();
      }
    });
  }

  // Change Layout Color
  changeLayoutColor(color: any) {
    this.color = color;
    this.store.dispatch(changetheme({ color }));
    document.documentElement.setAttribute('data-bs-theme', color);
    this.cdr.detectChanges();
  }

  // Change Topbar Color
  changeTopbar(topbar: any) {
    this.topbar = topbar;
    this.store.dispatch(changetopbarcolor({ topbar }));
    document.documentElement.setAttribute('data-topbar-color', topbar);
    this.cdr.detectChanges();
  }

  // Change Menu Color
  changeMenu(menu: any) {
    this.menuColor = menu;
    this.store.dispatch(changemenucolor({ menu }));
    document.documentElement.setAttribute('data-menu-color', menu);
    this.cdr.detectChanges();
  }

  // Change Sidebar Size
  changeSize(size: any) {
    this.menuSize = size;
    this.store.dispatch(changesidebarsize({ size }));
    document.documentElement.setAttribute('data-menu-size', size);
    document.documentElement.setAttribute('data-sidenav-size', size);
    this.cdr.detectChanges();
  }

  // Reset Option
  reset() {
    this.store.dispatch(resetState());
    this.color = 'light';
    this.topbar = 'light';
    this.menuColor = 'dark';
    this.menuSize = 'default';
    document.documentElement.setAttribute('data-bs-theme', 'light');
    document.documentElement.setAttribute('data-topbar-color', 'light');
    document.documentElement.setAttribute('data-menu-color', 'dark');
    document.documentElement.setAttribute('data-menu-size', 'default');
    document.documentElement.setAttribute('data-sidenav-size', 'default');
    document.documentElement.classList.remove('sidebar-enable');
    this.cdr.detectChanges();
  }
}
