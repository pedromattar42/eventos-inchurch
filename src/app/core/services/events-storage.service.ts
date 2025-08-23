import { Injectable, signal, computed } from '@angular/core';
import { EventData } from '../../shared/components/molecules/event-card/event-card.component';

@Injectable({
  providedIn: 'root'
})
export class EventsStorageService {
  // Signal privado para armazenar os eventos
  private _events = signal<EventData[]>([]);

  // Signal público readonly para acessar os eventos
  readonly events = computed(() => this._events());

  // Signal para controlar loading state
  private _isLoading = signal<boolean>(false);
  readonly isLoading = computed(() => this._isLoading());

  // Signal para busca
  private _searchTerm = signal<string>('');
  readonly searchTerm = computed(() => this._searchTerm());

  // Eventos filtrados pela busca
  readonly filteredEvents = computed(() => {
    const events = this._events();
    const search = this._searchTerm().toLowerCase().trim();

    if (!search) {
      return events;
    }

    return events.filter(event =>
      event.title.toLowerCase().includes(search) ||
      event.description.toLowerCase().includes(search)
    );
  });

  // Métodos para manipular o storage
  
  /**
   * Define todos os eventos (usado quando carrega da API)
   */
  setEvents(events: EventData[]): void {
    this._events.set([...events]);
  }

  /**
   * Adiciona um novo evento ao início da lista
   */
  addEvent(event: EventData): void {
    this._events.update(currentEvents => [event, ...currentEvents]);
  }

  /**
   * Atualiza um evento existente
   */
  updateEvent(updatedEvent: EventData): void {
    this._events.update(currentEvents =>
      currentEvents.map(event =>
        (event.id === updatedEvent.id || event.id.toString() === updatedEvent.id.toString())
          ? updatedEvent
          : event
      )
    );
  }

  /**
   * Remove um evento pelo ID
   */
  removeEvent(eventId: string): void {
    this._events.update(currentEvents =>
      currentEvents.filter(event =>
        event.id !== eventId && event.id.toString() !== eventId
      )
    );
  }

  /**
   * Busca um evento pelo ID
   */
  getEventById(eventId: string): EventData | undefined {
    return this._events().find(event =>
      event.id === eventId || event.id.toString() === eventId
    );
  }

  /**
   * Limpa todos os eventos
   */
  clearEvents(): void {
    this._events.set([]);
  }

  /**
   * Retorna o total de eventos
   */
  getTotalCount(): number {
    return this._events().length;
  }

  /**
   * Verifica se existe um evento com o ID especificado
   */
  hasEvent(eventId: string): boolean {
    return this._events().some(event => event.id === eventId);
  }

  /**
   * Define o estado de loading
   */
  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  /**
   * Adiciona múltiplos eventos
   */
  addEvents(events: EventData[]): void {
    this._events.update(currentEvents => [...events, ...currentEvents]);
  }


  /**
   * Define o termo de busca
   */
  setSearchTerm(searchTerm: string): void {
    this._searchTerm.set(searchTerm);
  }

  /**
   * Limpa o termo de busca
   */
  clearSearch(): void {
    this._searchTerm.set('');
  }
}
