import { Component, input, output, signal, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';

@Component({
  selector: 'app-input-field',
  imports: [CommonModule],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true
    }
  ]
})
export class InputFieldComponent implements ControlValueAccessor {
  // Inputs
  id = input<string>('');
  label = input<string>('');
  type = input<InputType>('text');
  placeholder = input<string>('');
  icon = input<string>('');
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  autocomplete = input<string>('');
  hasError = input<boolean>(false);
  errorMessage = input<string>('');
  showPasswordToggle = input<boolean>(false);

  // Outputs
  onFocus = output<FocusEvent>();
  onBlur = output<FocusEvent>();
  onInput = output<Event>();

  // Internal state
  value = signal<string>('');
  showPassword = signal<boolean>(false);
  isFocused = signal<boolean>(false);

  // ControlValueAccessor implementation
  private onChange = (value: string) => {};
  private onTouched = () => {};

  writeValue(value: string): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }

  // Event handlers
  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = target.value;
    this.value.set(newValue);
    this.onChange(newValue);
    this.onInput.emit(event);
  }

  onInputFocus(event: FocusEvent): void {
    this.isFocused.set(true);
    this.onFocus.emit(event);
  }

  onInputBlur(event: FocusEvent): void {
    this.isFocused.set(false);
    this.onTouched();
    this.onBlur.emit(event);
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(show => !show);
  }

  get inputType(): string {
    if (this.type() === 'password' && this.showPasswordToggle()) {
      return this.showPassword() ? 'text' : 'password';
    }
    return this.type();
  }

  get hasIcon(): boolean {
    return !!this.icon();
  }

  get hasPasswordToggle(): boolean {
    return this.type() === 'password' && this.showPasswordToggle();
  }

  get inputClasses(): string {
    const classes = ['input-field'];
    
    if (this.hasError()) {
      classes.push('error');
    }
    
    if (this.isFocused()) {
      classes.push('focused');
    }
    
    if (this.disabled()) {
      classes.push('disabled');
    }
    
    return classes.join(' ');
  }

  get wrapperClasses(): string {
    const classes = ['input-wrapper'];
    
    if (this.hasIcon) {
      classes.push('has-icon');
    }
    
    if (this.hasPasswordToggle) {
      classes.push('has-toggle');
    }
    
    return classes.join(' ');
  }
}
