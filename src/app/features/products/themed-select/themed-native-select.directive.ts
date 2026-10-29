import { AfterViewInit, Directive, DoCheck, ElementRef, OnDestroy, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({ selector: 'select[appThemedDropdown]', standalone: true })
export class ThemedNativeSelectDirective implements AfterViewInit, DoCheck, OnDestroy {
  private readonly select = inject<ElementRef<HTMLSelectElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);
  private wrapper?: HTMLDivElement;
  private trigger?: HTMLButtonElement;
  private menu?: HTMLDivElement;
  private observer?: MutationObserver;
  private open = false;
  private originalTabIndex: string | null = null;
  private originalAriaHidden: string | null = null;

  ngAfterViewInit(): void {
    const parent = this.select.parentNode;
    if (!parent) return;
    this.wrapper = this.document.createElement('div');
    this.wrapper.className = 'themed-native-select';
    if (this.select.classList.contains('page-select-input')) this.wrapper.classList.add('themed-native-page-size');
    if (this.select.classList.contains('filter-dropdown')) this.wrapper.classList.add('themed-native-filter');
    if (this.select.style.width && this.select.style.width !== 'auto') {
      this.wrapper.style.width = this.select.style.width;
      this.wrapper.style.flex = `0 1 ${this.select.style.width}`;
    }
    if (this.select.style.minWidth) this.wrapper.style.minWidth = this.select.style.minWidth;
    if (this.select.style.maxWidth) this.wrapper.style.maxWidth = this.select.style.maxWidth;
    parent.insertBefore(this.wrapper, this.select);
    this.wrapper.appendChild(this.select);
    this.select.classList.add('themed-native-source');
    this.originalTabIndex = this.select.getAttribute('tabindex');
    this.originalAriaHidden = this.select.getAttribute('aria-hidden');
    this.select.setAttribute('tabindex', '-1');
    this.select.setAttribute('aria-hidden', 'true');

    this.trigger = this.document.createElement('button');
    this.trigger.type = 'button';
    this.trigger.className = 'themed-native-trigger';
    this.trigger.setAttribute('aria-haspopup', 'listbox');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.trigger.setAttribute('aria-label', this.select.getAttribute('aria-label') || this.select.labels?.[0]?.textContent?.trim() || 'Choose an option');
    this.trigger.innerHTML = '<span class="themed-native-value"></span><span class="themed-native-chevron" aria-hidden="true"></span>';
    this.wrapper.appendChild(this.trigger);
    this.trigger.addEventListener('click', this.toggle);
    this.trigger.addEventListener('keydown', this.onTriggerKeydown);
    this.select.addEventListener('change', this.sync);
    this.observer = new MutationObserver(() => { this.sync(); if (this.open) this.renderOptions(); });
    this.observer.observe(this.select, { childList: true, subtree: true, characterData: true });
    this.sync();
  }

  ngDoCheck(): void { this.sync(); }

  ngOnDestroy(): void {
    this.close();
    this.observer?.disconnect();
    this.trigger?.removeEventListener('click', this.toggle);
    this.trigger?.removeEventListener('keydown', this.onTriggerKeydown);
    this.select.removeEventListener('change', this.sync);
    if (this.originalTabIndex === null) this.select.removeAttribute('tabindex');
    else this.select.setAttribute('tabindex', this.originalTabIndex);
    if (this.originalAriaHidden === null) this.select.removeAttribute('aria-hidden');
    else this.select.setAttribute('aria-hidden', this.originalAriaHidden);
    if (this.wrapper?.parentNode) {
      this.wrapper.parentNode.insertBefore(this.select, this.wrapper);
      this.wrapper.remove();
    }
  }

  private sync = (): void => {
    if (!this.trigger) return;
    const label = this.select.selectedOptions[0]?.textContent?.trim() || 'Select option';
    const value = this.trigger.querySelector('.themed-native-value');
    if (value && value.textContent !== label) value.textContent = label;
    this.trigger.disabled = this.select.disabled;
  };

  private toggle = (): void => { this.open ? this.close() : this.show(); };

  private show(): void {
    if (!this.trigger || this.select.disabled) return;
    this.menu = this.document.createElement('div');
    this.menu.className = 'themed-native-menu';
    this.menu.setAttribute('role', 'listbox');
    this.menu.setAttribute('aria-label', this.trigger.getAttribute('aria-label') || 'Options');
    this.document.body.appendChild(this.menu);
    this.open = true;
    this.trigger.setAttribute('aria-expanded', 'true');
    this.trigger.classList.add('is-open');
    this.renderOptions();
    this.positionMenu();
    this.document.addEventListener('pointerdown', this.onOutsidePointer, true);
    this.document.addEventListener('keydown', this.onDocumentKeydown, true);
    this.document.addEventListener('scroll', this.onScroll, true);
    window.addEventListener('resize', this.onScroll);
  }

  private renderOptions(): void {
    if (!this.menu) return;
    this.menu.replaceChildren();
    for (const option of Array.from(this.select.options)) {
      if (option.hidden) continue;
      const button = this.document.createElement('button');
      button.type = 'button';
      button.className = 'themed-native-option';
      button.setAttribute('role', 'option');
      button.setAttribute('aria-selected', String(option.selected));
      button.disabled = option.disabled;
      if (option.selected) button.classList.add('is-selected');
      const label = this.document.createElement('span');
      label.textContent = option.textContent?.trim() || option.value;
      button.appendChild(label);
      if (option.selected) {
        const check = this.document.createElement('span');
        check.className = 'themed-native-check';
        check.textContent = '✓';
        check.setAttribute('aria-hidden', 'true');
        button.appendChild(check);
      }
      button.addEventListener('click', () => {
        this.select.value = option.value;
        this.select.dispatchEvent(new Event('change', { bubbles: true }));
        this.sync();
        this.close();
        this.trigger?.focus();
      });
      this.menu.appendChild(button);
    }
  }

  private positionMenu(): void {
    if (!this.trigger || !this.menu) return;
    const rect = this.trigger.getBoundingClientRect();
    const width = Math.max(rect.width, 180);
    this.menu.style.width = `${Math.min(width, window.innerWidth - 24)}px`;
    this.menu.style.left = `${Math.max(12, Math.min(rect.left, window.innerWidth - width - 12))}px`;
    const below = window.innerHeight - rect.bottom;
    if (below < 220 && rect.top > below) {
      this.menu.style.top = 'auto';
      this.menu.style.bottom = `${window.innerHeight - rect.top + 4}px`;
    } else {
      this.menu.style.bottom = 'auto';
      this.menu.style.top = `${rect.bottom + 4}px`;
    }
  }

  private close(): void {
    if (!this.open) return;
    this.open = false;
    this.menu?.remove();
    this.menu = undefined;
    this.trigger?.setAttribute('aria-expanded', 'false');
    this.trigger?.classList.remove('is-open');
    this.document.removeEventListener('pointerdown', this.onOutsidePointer, true);
    this.document.removeEventListener('keydown', this.onDocumentKeydown, true);
    this.document.removeEventListener('scroll', this.onScroll, true);
    window.removeEventListener('resize', this.onScroll);
  }

  private onOutsidePointer = (event: Event): void => {
    const target = event.target as Node;
    if (!this.wrapper?.contains(target) && !this.menu?.contains(target)) this.close();
  };
  private onScroll = (event: Event): void => { if (event.target !== this.menu) this.close(); };
  private onTriggerKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!this.open) this.show();
      this.menu?.querySelector<HTMLButtonElement>('.is-selected, .themed-native-option:not(:disabled)')?.focus();
    }
  };
  private onDocumentKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') { this.close(); this.trigger?.focus(); return; }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const items = Array.from(this.menu?.querySelectorAll<HTMLButtonElement>('.themed-native-option:not(:disabled)') || []);
    const current = items.indexOf(this.document.activeElement as HTMLButtonElement);
    const next = event.key === 'ArrowDown' ? Math.min(current + 1, items.length - 1) : Math.max(current - 1, 0);
    if (items[next]) { event.preventDefault(); items[next].focus(); }
  };
}
