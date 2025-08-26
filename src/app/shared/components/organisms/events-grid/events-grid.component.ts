import { CommonModule } from '@angular/common';
import { Component, computed, input, output, ChangeDetectionStrategy } from '@angular/core';
import { EventCardComponent, EventData } from '../../molecules/event-card/event-card.component';
import { EventsListComponent } from '../../molecules/events-list/events-list.component';
import { PaginatorComponent } from '../../molecules/paginator/paginator.component';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-events-grid',
  imports: [CommonModule, EventCardComponent, PaginatorComponent, EventsListComponent, SkeletonModule],
  templateUrl: './events-grid.component.html',
  styleUrl: './events-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsGridComponent {
  events = input.required<EventData[]>();
  totalRecords = input.required<number>();
  rows = input<number>(8);
  first = input<number>(0);
  showListToggle = input<boolean>(true);
  isListView = input<boolean>(false);
  searchTerm = input<string>('');
  isLoading = input<boolean>(false);

  onPageChange = output<{ first: number; page: number; rows: number }>();
  onToggleView = output<void>();
  onEditEvent = output<EventData>();
  onDeleteEvent = output<EventData>();
  onCreateEvent = output<void>();

  currentPageEvents = computed(() => {
    const startIndex = this.first();
    const rows = this.rows();
    const endIndex = startIndex + rows;
    const allEvents = this.events();
    const result = allEvents.slice(startIndex, endIndex);

    return result;
  });

  // Computed para determinar se é busca sem resultados ou lista vazia
  isSearchWithNoResults = computed(() => {
    return this.events().length === 0 && this.searchTerm().trim().length > 0;
  });

  isEmptyList = computed(() => {
    return this.events().length === 0 && this.searchTerm().trim().length === 0;
  });

  handleEditEvent(event: EventData): void {
    this.onEditEvent.emit(event);
  }

  handleDeleteEvent(event: EventData): void {
    this.onDeleteEvent.emit(event);
  }

  handleCreateEvent(): void {
    this.onCreateEvent.emit();
  }
}
