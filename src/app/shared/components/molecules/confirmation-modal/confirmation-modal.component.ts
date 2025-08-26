import { Component, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventData } from '../event-card/event-card.component';

@Component({
  selector: 'app-confirmation-modal',
  imports: [CommonModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationModalComponent {
  isVisible = input<boolean>(false);
  event = input<EventData | null>(null);
  title = input<string>('Confirmar Exclusão');
  message = input<string>('Tem certeza que deseja excluir o evento?');
  confirmText = input<string>('Excluir Evento');
  cancelText = input<string>('Cancelar');

  onConfirm = output<void>();
  onCancel = output<void>();

  onConfirmClick(): void {
    this.onConfirm.emit();
  }

  onCancelClick(): void {
    this.onCancel.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel.emit();
    }
  }
}
