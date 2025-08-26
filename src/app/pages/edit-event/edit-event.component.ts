import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { EventFormComponent, EventFormData } from '../../shared/components/organisms/event-form/event-form.component';
import { EventsApiService } from '../../core/services/events-api.service';
import { EventsStorageService } from '../../core/services/events-storage.service';
import { EventData } from '../../shared/components/molecules/event-card/event-card.component';

@Component({
  selector: 'app-edit-event',
  imports: [CommonModule, EventFormComponent],
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.scss'
})
export class EditEventComponent implements OnInit {
  @ViewChild(EventFormComponent) eventForm!: EventFormComponent;

  eventToEdit = signal<EventData | null>(null);
  eventNotFound = signal<boolean>(false);

  constructor(
    private eventsApiService: EventsApiService,
    private eventsStorage: EventsStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEvent(eventId);
    } else {
      this.router.navigate(['/']);
    }
  }

  private loadEvent(eventId: string): void {
    const eventFromStorage = this.eventsStorage.getEventById(eventId);
    
    if (eventFromStorage) {
      this.eventToEdit.set(eventFromStorage);
    } else {
      this.eventsStorage.setLoading(true);
      
      this.eventsApiService.getEvents().subscribe({
        next: (events) => {
          const event = events.find(e =>
            e.id === eventId || e.id.toString() === eventId
          );
          if (event) {
            this.eventToEdit.set(event);
            this.eventsStorage.setEvents(events);
          } else {
            this.eventNotFound.set(true);
          }
          this.eventsStorage.setLoading(false);
        },
        error: (error) => {
          console.error('Erro ao carregar evento:', error);
          this.eventNotFound.set(true);
          this.eventsStorage.setLoading(false);
        }
      });
    }
  }

  get isLoading() {
    return this.eventsStorage.isLoading;
  }

  onSubmit(formData: EventFormData): void {
    const currentEvent = this.eventToEdit();
    if (!currentEvent) return;

    this.eventsStorage.setLoading(true);

    this.eventsApiService.updateEvent({
      id: currentEvent.id,
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl,
      hasActiveTickets: formData.hasActiveTickets
    }).subscribe({
      next: (updatedEvent) => {
        // Atualiza o storage primeiro (sem loading para evitar tremida)
        this.eventsStorage.updateEvent(updatedEvent);

        // Mostra o toast
        this.eventForm.showSuccess('Evento atualizado com sucesso!');

        // Navega após um delay menor
        setTimeout(() => {
          this.eventsStorage.setLoading(false);
          this.router.navigate(['/']);
        }, 1200);
      },
      error: () => {
        this.eventsStorage.setLoading(false);
        this.eventForm.showError('Erro ao atualizar evento. Tente novamente.');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}
