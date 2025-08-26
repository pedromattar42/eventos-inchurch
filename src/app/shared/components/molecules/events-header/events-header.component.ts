import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-events-header',
  imports: [CommonModule, FormsModule, ProgressSpinnerModule, ToastModule],
  templateUrl: './events-header.component.html',
  styleUrl: './events-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService]
})
export class EventsHeaderComponent {
  // Inputs
  title = input<string>('Eventos');
  showNewButton = input<boolean>(true);
  showViewToggle = input<boolean>(true);
  isListView = input<boolean>(false);
  isLoading = input<boolean>(false);
  searchTerm = input<string>('');
  
  // Outputs
  onSearch = output<string>();
  onFilter = output<void>();
  onExport = output<void>();
  onToggleView = output<void>();
  onNewEvent = output<void>();

  constructor(private messageService: MessageService) {}

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.onSearch.emit(value);
  }

  onFilterClick(): void {
    this.showNotImplemented();
    this.onFilter.emit();
  }

  onExportClick(): void {
    this.showNotImplemented();
    this.onExport.emit();
  }

  private showNotImplemented(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Método não implementado',
      detail: 'Funcionalidade apenas visual.',
      life: 3000
    });
  }

  onViewToggleClick(): void {
    this.onToggleView.emit();
  }

  onNewEventClick(): void {
    this.onNewEvent.emit();
  }

  clearSearch(): void {
    this.onSearch.emit('');
  }
}
