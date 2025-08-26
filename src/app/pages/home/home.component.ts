import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventData } from '../../shared/components/molecules/event-card/event-card.component';
import { EventsGridComponent } from '../../shared/components/organisms/events-grid/events-grid.component';
import { EventsHeaderComponent } from '../../shared/components/molecules/events-header/events-header.component';
import { ConfirmationModalComponent } from '../../shared/components/molecules/confirmation-modal/confirmation-modal.component';
import { EventsApiService } from '../../core/services/events-api.service';
import { EventsStorageService } from '../../core/services/events-storage.service';
import { UserPreferencesService } from '../../core/services/user-preferences.service';

@Component({
  selector: 'app-home',
  imports: [EventsGridComponent, EventsHeaderComponent, ConfirmationModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  totalRecords = signal(0);
  first = signal(0);

  showDeleteModal = signal<boolean>(false);
  eventToDelete = signal<EventData | null>(null);

  constructor(
    private eventsApiService: EventsApiService,
    private eventsStorage: EventsStorageService,
    private router: Router,
    private userPreferences: UserPreferencesService
  ) {}

  ngOnInit(): void {
    // Limpa o filtro de busca ao inicializar a tela
    this.eventsStorage.clearSearch();
    this.loadEvents();
  }

  private loadEvents(): void {
    this.eventsStorage.setLoading(true);

    this.eventsApiService.getEvents().subscribe({
      next: (events) => {
        this.eventsStorage.setEvents(events);
        this.updateTotalRecords();
        this.eventsStorage.setLoading(false);
      },
      error: () => {
        this.eventsStorage.setLoading(false);
        this.eventsStorage.setEvents([]);
      }
    });
  }

  get events() {
    return this.eventsStorage.filteredEvents; // Usa eventos filtrados
  }

  get isLoading() {
    return this.eventsStorage.isLoading;
  }

  get searchTerm() {
    return this.eventsStorage.searchTerm;
  }

  get isListView() {
    return this.userPreferences.isListView;
  }

  get rows() {
    return this.userPreferences.rows;
  }

  onPageChange(event: { first: number; page: number; rows: number }): void {
    this.first.set(event.first);

    if (event.rows !== this.rows()) {
      this.userPreferences.setRowsPerPage(event.rows);
    }
  }

  onToggleView(): void {
    this.userPreferences.toggleListView();
  }

  onEditEvent(event: EventData): void {
    this.router.navigate(['/edit-event', event.id]);
  }

  onDeleteEvent(event: EventData): void {
    this.eventToDelete.set(event);
    this.showDeleteModal.set(true);
  }

  onConfirmDelete(): void {
    const event = this.eventToDelete();
    if (event) {
      this.confirmDeleteEvent(event);
    }
    this.closeDeleteModal();
  }

  onCancelDelete(): void {
    this.closeDeleteModal();
  }

  private closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.eventToDelete.set(null);
  }

  private confirmDeleteEvent(event: EventData): void {
    this.eventsStorage.setLoading(true);

    this.eventsApiService.deleteEvent(event.id).subscribe({
      next: () => {
        this.eventsStorage.removeEvent(event.id);
        this.totalRecords.update(count => count - 1);

        this.checkAndAdjustPagination();

        this.eventsStorage.setLoading(false);
      },
      error: () => {
        this.eventsStorage.setLoading(false);
      }
    });
  }

  /**
   * Verifica se a página atual ficou vazia após exclusão e ajusta a paginação
   */
  private checkAndAdjustPagination(): void {
    const currentFirst = this.first();
    const currentRows = this.rows();
    const totalRecords = this.totalRecords();

    if (totalRecords === 0) {
      this.first.set(0);
      return;
    }

    const maxFirstIndex = Math.max(0, totalRecords - 1);
    const maxPageFirstIndex = Math.floor(maxFirstIndex / currentRows) * currentRows;

    if (currentFirst > maxPageFirstIndex) {
      this.first.set(maxPageFirstIndex);
    }
  }

  onSearch(searchTerm: string): void {
    this.eventsStorage.setSearchTerm(searchTerm);
    this.first.set(0);
    this.updateTotalRecords();
  }

  onFilter(): void {
    // Método implementado no EventsHeader com toast
  }

  onExport(): void {
    // Método implementado no EventsHeader com toast
  }

  onNewEvent(): void {
    this.eventsStorage.clearSearch()
    this.router.navigate(['/create-event']);
  }

  // Atualiza o totalRecords para usar eventos filtrados
  private updateTotalRecords(): void {
    this.totalRecords.set(this.eventsStorage.filteredEvents().length);
  }
}