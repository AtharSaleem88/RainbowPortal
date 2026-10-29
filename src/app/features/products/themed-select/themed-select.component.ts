import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

export interface ThemedSelectOption {
  value: string | number;
  label: string;
}

@Component({
  selector: 'app-themed-select',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="themed-select" ngbDropdown container="body">
      <button type="button" class="themed-select-trigger" ngbDropdownToggle
              [disabled]="disabled" [attr.aria-label]="ariaLabel" [title]="selectedLabel">
        <span class="themed-select-value">{{ selectedLabel }}</span>
        <iconify-icon icon="solar:alt-arrow-down-linear" aria-hidden="true"></iconify-icon>
      </button>
      <div class="themed-select-menu" ngbDropdownMenu [attr.aria-label]="ariaLabel">
        @for (option of options; track option.value) {
          <button type="button" ngbDropdownItem class="themed-select-option"
                  [class.selected]="value === option.value" (click)="select(option.value)">
            <span>{{ option.label }}</span>
            @if (value === option.value) {
              <iconify-icon icon="solar:check-circle-bold" aria-hidden="true"></iconify-icon>
            }
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; min-width: 0; width: 100%; }
    :host(.themed-page-size) { flex: 0 0 105px; width: 105px; }
    :host(.themed-filter) { flex: 1 1 180px; min-width: 180px; }
    :host(.section-category-select) .themed-select-trigger { min-height: 42px; }
    .themed-select { width: 100%; }
    .themed-select-trigger {
      display: flex; align-items: center; justify-content: space-between; gap: 10px;
      width: 100%; min-height: 36px; padding: 7px 11px 7px 13px;
      border: 1px solid #cbd5e1; border-radius: 8px; background: #fff;
      color: #26315f; font-size: 12px; font-weight: 600; text-align: left;
      transition: border-color .15s ease, box-shadow .15s ease;
    }
    .themed-select-trigger::after { display: none; }
    .themed-select-trigger:hover, .themed-select-trigger:focus-visible, .themed-select-trigger.show {
      border-color: #2e3192; box-shadow: 0 0 0 3px rgba(46, 49, 146, .09); outline: 0;
    }
    .themed-select-trigger:disabled { opacity: .6; cursor: not-allowed; }
    .themed-select-value { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .themed-select-trigger iconify-icon { flex-shrink: 0; color: #64748b; font-size: 14px; transition: transform .15s ease; }
    .themed-select-trigger.show iconify-icon { transform: rotate(180deg); }
    .themed-select-menu {
      z-index: 1100;
      min-width: 220px; max-width: min(360px, calc(100vw - 24px)); max-height: 270px; overflow-y: auto;
      padding: 5px; border: 1px solid #e0e5ee; border-radius: 10px; background: #fff;
      box-shadow: 0 12px 28px rgba(30, 38, 82, .14);
    }
    .themed-select-option {
      display: flex; align-items: center; justify-content: space-between; gap: 10px;
      width: 100%; min-height: 36px; padding: 8px 10px; border: 0; border-radius: 7px;
      background: transparent; color: #475569; font-size: 12px; font-weight: 500;
      white-space: normal; text-align: left;
    }
    .themed-select-option:hover, .themed-select-option:focus-visible { background: #f3f4fc; color: #2e3192; outline: 0; }
    .themed-select-option.selected { background: #eef0fb; color: #2e3192; font-weight: 700; }
    .themed-select-option iconify-icon { flex-shrink: 0; font-size: 15px; }
  `],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ThemedSelectComponent), multi: true }],
})
export class ThemedSelectComponent implements ControlValueAccessor {
  @Input() options: ThemedSelectOption[] = [];
  @Input() ariaLabel = 'Select option';
  value: string | number = '';
  disabled = false;
  private onChange: (value: string | number) => void = () => {};
  private onTouched: () => void = () => {};

  get selectedLabel(): string {
    return this.options.find(option => option.value === this.value)?.label || 'Select option';
  }

  writeValue(value: string | number): void { this.value = value ?? ''; }
  registerOnChange(fn: (value: string | number) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.disabled = disabled; }
  select(value: string | number): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
}
