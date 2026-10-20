import { Component, ChangeDetectorRef, inject, Renderer2, type OnInit, HostListener } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { FooterComponent } from '../footer/footer.component';
import { RightSidebarComponent } from '../rightsidebar/rightsidebar.component';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgbActiveOffcanvas, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { getSidebarsize } from '@store/layout/layout-selector';
import { changesidebarsize } from '@store/layout/layout-action';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    SidebarComponent,
    TopbarComponent,
    FooterComponent,
    RouterModule,
  ],
  templateUrl: './layout.component.html',
  styles: ``,
  providers: [NgbActiveOffcanvas],
})
export class LayoutComponent implements OnInit {
  private activePage: { title?: string; pageTitle?: string } | undefined;
  private routeTitle = '';

  get title(): string {
    return this.activePage?.pageTitle || this.activePage?.title || this.routeTitle;
  }
  layoutType: any;

  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private store = inject(Store);
  private renderer = inject(Renderer2);
  private offcanvasService = inject(NgbOffcanvas);

  private wasMobile = false;

  ngOnInit(): void {
    this.wasMobile = document.documentElement.clientWidth <= 1140;
    this.store.select('layout').subscribe((data) => {
      this.layoutType = data.LAYOUT;
      document.documentElement.setAttribute('data-bs-theme', data.LAYOUT_THEME);

      document.documentElement.setAttribute('data-menu-color', data.MENU_COLOR);
      document.documentElement.setAttribute(
        'data-topbar-color',
        data.TOPBAR_COLOR,
      );
      document.documentElement.setAttribute('data-menu-size', data.MENU_SIZE);
      document.documentElement.setAttribute('data-sidenav-size', data.MENU_SIZE);
    });

    if (this.wasMobile) {
      this.onResize();
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (document.documentElement.clientWidth <= 1140) {
          document.documentElement.classList.remove('sidebar-enable');
          const backdrop = document.querySelector('.offcanvas-backdrop');
          if (backdrop) {
            this.renderer.removeChild(document.body, backdrop);
            this.renderer.setStyle(document.body, 'overflow', null);
            this.renderer.setStyle(document.body, 'paddingRight', null);
          }
        }
      }
    });
  }

  @HostListener('window:resize')
  onResize() {
    const isMobile = document.documentElement.clientWidth <= 1140;
    if (isMobile) {
      if (!this.wasMobile) {
        this.wasMobile = true;
        this.store.dispatch(changesidebarsize({ size: 'hidden' }));
        document.documentElement.setAttribute('data-menu-size', 'hidden');
        document.documentElement.setAttribute('data-sidenav-size', 'hidden');
      }
    } else {
      if (this.wasMobile) {
        this.wasMobile = false;
        this.store.dispatch(changesidebarsize({ size: 'default' }));
        document.documentElement.setAttribute('data-menu-size', 'default');
        document.documentElement.setAttribute('data-sidenav-size', 'default');
      }
      document.documentElement.classList.remove('sidebar-enable');
      const backdrop = document.querySelector('.offcanvas-backdrop');
      if (backdrop) {
        this.renderer.removeChild(document.body, backdrop);
        this.renderer.setStyle(document.body, 'overflow', null);
        this.renderer.setStyle(document.body, 'paddingRight', null);
      }
    }
  }

  onActivate(componentReference: any) {
    this.activePage = componentReference;
    let route = this.router.routerState.snapshot.root;
    this.routeTitle = '';
    while (route) {
      this.routeTitle = route.data['title'] || this.routeTitle;
      if (!route.firstChild) break;
      route = route.firstChild;
    }
    this.cdr.detectChanges();
  }

  onSettingsButtonClicked() {
    this.offcanvasService.open(RightSidebarComponent, {
      position: 'end',
      panelClass: 'border-0',
    });
  }

  onToggleMobileMenu() {
    const isMobile = document.documentElement.clientWidth <= 1140;
    const currentSize = document.documentElement.getAttribute('data-menu-size');

    if (isMobile || currentSize === 'hidden') {
      const hasBackdrop = document.querySelector('.offcanvas-backdrop');
      if (document.documentElement.classList.contains('sidebar-enable')) {
        document.documentElement.classList.remove('sidebar-enable');
        if (hasBackdrop) {
          this.renderer.removeChild(document.body, hasBackdrop);
          this.renderer.setStyle(document.body, 'overflow', null);
          this.renderer.setStyle(document.body, 'paddingRight', null);
        }
      } else {
        document.documentElement.classList.add('sidebar-enable');
        this.showBackdrop();
      }
    } else {
      // Desktop: Toggle between uncollapsed (default) and collapsed (condensed)
      const newSize = (currentSize === 'condensed' || currentSize === 'sm-hover') ? 'default' : 'condensed';
      this.store.dispatch(changesidebarsize({ size: newSize }));
      document.documentElement.setAttribute('data-menu-size', newSize);
      document.documentElement.setAttribute('data-sidenav-size', newSize);
    }
  }

  showBackdrop() {
    const backdrop = this.renderer.createElement('div');
    this.renderer.addClass(backdrop, 'offcanvas-backdrop');
    this.renderer.addClass(backdrop, 'fade');
    this.renderer.addClass(backdrop, 'show');
    this.renderer.appendChild(document.body, backdrop);
    this.renderer.setStyle(document.body, 'overflow', 'hidden');

    if (window.innerWidth > 1040) {
      this.renderer.setStyle(document.body, 'paddingRight', '15px');
    }

    this.renderer.listen(backdrop, 'click', () => {
      document.documentElement.classList.remove('sidebar-enable');
      this.renderer.removeChild(document.body, backdrop);
      this.renderer.setStyle(document.body, 'overflow', null);
      this.renderer.setStyle(document.body, 'paddingRight', null);
    });
  }
}

export { LayoutComponent as Layout, LayoutComponent as AdminLayoutComponent };
