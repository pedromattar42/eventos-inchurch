import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventData } from '../event-card/event-card.component';

@Component({
  selector: 'app-events-list',
  imports: [CommonModule],
  templateUrl: './events-list.component.html',
  styleUrl: './events-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsListComponent {
  events = input.required<EventData[]>();

  onEdit = output<EventData>();
  onDelete = output<EventData>();

  formatDate(date: Date | string | undefined): string {
    if (!date) {
      return 'Data não informada';
    }

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Data inválida';
    }

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(dateObj);
  }

  editEvent(event: EventData): void {
    this.onEdit.emit(event);
  }

  deleteEvent(event: EventData): void {
    this.onDelete.emit(event);
  }
}
