import { Component, input, output, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputFieldComponent } from '../../atoms/input-field/input-field.component';
import { EventData } from '../../molecules/event-card/event-card.component';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

export interface EventFormData {
  title: string;
  description: string;
  imageUrl?: string;
  hasActiveTickets: boolean;
}

@Component({
  selector: 'app-event-form',
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent, ButtonModule, ToastModule],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService]
})
export class EventFormComponent implements OnInit {
  // Inputs
  event = input<EventData | null>(null);
  isLoading = input<boolean>(false);
  submitButtonText = input<string>('Salvar');
  title = input<string>('Novo Evento');

  // Outputs
  onSubmit = output<EventFormData>();
  onCancel = output<void>();

  // Form
  eventForm!: FormGroup;
  errorMessage = signal<string>('');

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    const eventData = this.event();
    
    this.eventForm = this.fb.group({
      title: [eventData?.title || '', [Validators.required, Validators.minLength(3)]],
      description: [eventData?.description || '', [Validators.required, Validators.minLength(10)]],
      imageUrl: [eventData?.imageUrl || ''],
      hasActiveTickets: [eventData?.hasActiveTickets || false]
    });
  }

  onFormSubmit(): void {
    if (this.eventForm.valid) {
      const formData: EventFormData = this.eventForm.value;
      this.onSubmit.emit(formData);
    } else {
      this.markFormGroupTouched();
      this.showError('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  onCancelClick(): void {
    this.onCancel.emit();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.eventForm.controls).forEach(key => {
      const control = this.eventForm.get(key);
      control?.markAsTouched();
    });
  }

  showSuccess(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: message,
      life: 3000
    });
  }

  showError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: message,
      life: 5000
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.eventForm.get(fieldName);
    
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        const fieldLabels: { [key: string]: string } = {
          title: 'Título',
          description: 'Descrição'
        };
        return `${fieldLabels[fieldName]} é obrigatório`;
      }
      if (field.errors['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `Deve ter pelo menos ${minLength} caracteres`;
      }
    }
    
    return '';
  }

  get isEditMode(): boolean {
    return !!this.event();
  }
}
