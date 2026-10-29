import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MASTER_CATEGORIES } from '../data';
import { ThemedSelectComponent, ThemedSelectOption } from '../../products/themed-select/themed-select.component';

interface LandingSection {
  id: string;
  categoryId: string;
  displayName: string;
}

const STORAGE_KEY = 'rainbow-landing-product-sections';
const DEFAULT_SECTIONS: LandingSection[] = [
  { id: 'monthly-deals', categoryId: 'all', displayName: 'Monthly Special Deals' },
  { id: 'fresh-farm', categoryId: 'CAT-03', displayName: 'Fresh From Farm' },
  { id: 'rainbow-finds', categoryId: 'all', displayName: 'Rainbow Finds' },
  { id: 'frozen-food', categoryId: 'CAT-20', displayName: 'Frozen Food Section' },
  { id: 'price-drops', categoryId: 'all', displayName: 'Price Drops' },
];

@Component({
  selector: 'app-landing-sections',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, ThemedSelectComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './landing-sections.component.html',
  styleUrl: './landing-sections.component.scss',
})
export class LandingSectionsComponent {
  title = 'LANDING PAGE SECTIONS';
  categories = MASTER_CATEGORIES;
  get categoryOptions(): ThemedSelectOption[] {
    return [{ value: 'all', label: 'All categories' }, ...this.categories.map(category => ({ value: category.id, label: category.name }))];
  }
  get newCategoryOptions(): ThemedSelectOption[] {
    return [{ value: '', label: 'Select category' }, ...this.categoryOptions];
  }
  sections: LandingSection[] = this.loadSections();
  private savedSnapshot = JSON.stringify(this.sections);
  newCategoryId = '';
  newDisplayName = '';
  message = '';
  error = '';

  get isDirty(): boolean {
    return JSON.stringify(this.sections) !== this.savedSnapshot;
  }

  discardChanges(): void {
    this.sections = JSON.parse(this.savedSnapshot) as LandingSection[];
    this.error = '';
    this.message = '';
  }

  moveSection(index: number, direction: -1 | 1): void {
    const target = index + direction;
    if (target < 0 || target >= this.sections.length) return;
    moveItemInArray(this.sections, index, target);
    this.message = '';
  }

  getCategoryName(id: string): string {
    return id === 'all' ? 'All categories' : this.categories.find(category => category.id === id)?.name || 'Unknown category';
  }

  onNewCategoryChange(): void {
    if (!this.newDisplayName.trim() && this.newCategoryId) {
      this.newDisplayName = this.getCategoryName(this.newCategoryId);
    }
  }

  addSection(): void {
    const name = this.newDisplayName.trim();
    if (!this.newCategoryId || !name) {
      this.error = 'Select a category and enter a display name.';
      return;
    }
    this.sections = [...this.sections, { id: `section-${Date.now()}`, categoryId: this.newCategoryId, displayName: name }];
    this.newCategoryId = '';
    this.newDisplayName = '';
    this.error = '';
    this.message = '';
  }

  removeSection(id: string): void {
    this.sections = this.sections.filter(section => section.id !== id);
    this.message = '';
  }

  drop(event: CdkDragDrop<LandingSection[]>): void {
    moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
    this.message = '';
  }

  save(): void {
    if (this.sections.some(section => !section.displayName.trim() || !this.isValidCategory(section.categoryId))) {
      this.error = 'Each section needs a display name and a valid category.';
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.sections.map(section => ({
        ...section,
        displayName: section.displayName.trim(),
      }))));
      this.sections = this.sections.map(section => ({ ...section, displayName: section.displayName.trim() }));
      this.savedSnapshot = JSON.stringify(this.sections);
      this.error = '';
      this.message = 'Landing page sections saved in this browser.';
    } catch {
      this.error = 'Could not save changes in this browser.';
    }
  }

  private isValidCategory(id: string): boolean {
    return id === 'all' || this.categories.some(category => category.id === id);
  }

  private loadSections(): LandingSection[] {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (Array.isArray(stored) && stored.every(item =>
        typeof item.id === 'string' && typeof item.displayName === 'string' &&
        typeof item.categoryId === 'string' && this.isValidCategory(item.categoryId))) {
        return stored;
      }
    } catch { /* Use the default storefront sections. */ }
    return DEFAULT_SECTIONS.map(section => ({ ...section }));
  }
}
