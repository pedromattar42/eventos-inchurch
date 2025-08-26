import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventFormComponent, EventFormData } from '../../shared/components/organisms/event-form/event-form.component';
import { EventsApiService } from '../../core/services/events-api.service';
import { EventsStorageService } from '../../core/services/events-storage.service';

@Component({
  selector: 'app-create-event',
  imports: [CommonModule, EventFormComponent],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss'
})
export class CreateEventComponent {
  @ViewChild(EventFormComponent) eventForm!: EventFormComponent;
  constructor(
    private eventsApiService: EventsApiService,
    private eventsStorage: EventsStorageService,
    private router: Router
  ) {}

  get isLoading() {
    return this.eventsStorage.isLoading;
  }

  onSubmit(formData: EventFormData): void {
    this.eventsStorage.setLoading(true);

    this.eventsApiService.createEvent({
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl,
      hasActiveTickets: formData.hasActiveTickets
    }).subscribe({
      next: (event) => {
        this.eventsStorage.addEvent(event);

        this.eventForm.showSuccess('Evento criado com sucesso!');

        setTimeout(() => {
          this.eventsStorage.setLoading(false);
          this.router.navigate(['/']);
        }, 1200);
      },
      error: () => {
        this.eventsStorage.setLoading(false);
        this.eventForm.showError('Erro ao criar evento. Tente novamente.');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}
