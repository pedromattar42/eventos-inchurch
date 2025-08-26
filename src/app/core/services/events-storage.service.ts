import { Injectable, signal, computed } from '@angular/core';
import { EventData } from '../../shared/components/molecules/event-card/event-card.component';

@Injectable({
  providedIn: 'root'
})
export class EventsStorageService {
  // Signal privado para armazenar os eventos
  private _events = signal<EventData[]>([]);

  // Signal público para acessar os eventos
  readonly events = computed(() => this._events());

  // Signal para controlar o loading
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
      event.title.toLowerCase().includes(search)
    );
  });
  
  /**
   * Define todos os eventos (usado quando carrega do JSON-SERVER)
   */
  setEvents(events: EventData[]): void {
    this._events.set([...events]);
  }

  /**
   * Adiciona um novo evento na lista
   */
  addEvent(event: EventData): void {
    this._events.update(currentEvents => {
      // Evita duplicatas
      const exists = currentEvents.some(e =>
        e.id === event.id || e.id.toString() === event.id.toString()
      );
      if (exists) return currentEvents;

      return [event, ...currentEvents];
    });
  }

  /**
   * Atualiza um evento existente
   */
  updateEvent(updatedEvent: EventData): void {
    this._events.update(currentEvents => {
      let hasChanged = false;
      const newEvents = currentEvents.map(event => {
        if (event.id === updatedEvent.id || event.id.toString() === updatedEvent.id.toString()) {
          hasChanged = true;
          return updatedEvent;
        }
        return event;
      });

      // Só retorna novo array se houve mudança
      return hasChanged ? newEvents : currentEvents;
    });
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
