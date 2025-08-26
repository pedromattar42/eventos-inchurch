import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PaginatorConfig {
  totalRecords: number;
  rows: number;
  first?: number;
}

@Component({
  selector: 'app-paginator',
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent {
  totalRecords = input.required<number>();
  rows = input<number>(10);
  first = input<number>(0);

  onPageChange = output<{ first: number; page: number; rows: number }>();

  totalPages = computed(() => Math.ceil(this.totalRecords() / this.rows()));
  currentPage = computed(() => Math.floor(this.first() / this.rows()));

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        for (let i = 1; i <= Math.min(4, total - 1); i++) {
          pages.push(i);
        }
        if (total > 5) {
          pages.push('...');
        }
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        if (total > 5) {
          pages.push('...');
        }
        for (let i = Math.max(total - 3, 2); i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current; i <= current + 2; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      }
    }

    return pages;
  });

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages()) return;

    const first = page * this.rows();
    this.onPageChange.emit({
      first,
      page,
      rows: this.rows()
    });
  }

  previousPage(): void {
    const current = this.currentPage();
    if (current > 0) {
      this.goToPage(current - 1);
    }
  }

  nextPage(): void {
    const current = this.currentPage();
    if (current < this.totalPages() - 1) {
      this.goToPage(current + 1);
    }
  }

  isCurrentPage(page: number | string): boolean {
    return typeof page === 'number' && page === this.currentPage() + 1;
  }

  canGoPrevious(): boolean {
    return this.currentPage() > 0;
  }

  canGoNext(): boolean {
    return this.currentPage() < this.totalPages() - 1;
  }
}
