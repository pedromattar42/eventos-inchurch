import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface EventData {
  id: string;
  title: string;
  description: string;
  publishedDate: Date | string;
  imageUrl?: string;
  hasActiveTickets: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

@Component({
  selector: 'app-event-card',
  imports: [CommonModule],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventCardComponent {
  event = input.required<EventData>();

  onEdit = output<EventData>();
  onDelete = output<EventData>();

  editEvent(): void {
    this.onEdit.emit(this.event());
  }

  deleteEvent(): void {
    this.onDelete.emit(this.event());
  }

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
}
