import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  forwardRef
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Config } from '../../models';

@Component({
  selector: 'app-text-input',
  template: `
    @if (formControl) {
      <mat-form-field appearance="fill" style="width: 100%;" [color]="showError ? 'warn' : undefined">
        <mat-label>{{ config?.title }}</mat-label>
        @if (!isMultiline) {
          <input
            matInput
            [type]="'text'"
            [formControl]="formControl"
            (blur)="onTouched()"
          />
        } @else {
          <textarea
            matInput
            [formControl]="formControl"
            (blur)="onTouched()"
          ></textarea>
        }
        @if (errorMessage) {
          <mat-error>{{ errorMessage }}</mat-error>
        }
      </mat-form-field>
    }
  `,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() config?: Config;
  @Input() isMultiline = false;
  @Input() control?: AbstractControl;

  get formControl(): FormControl | null {
    return this.control instanceof FormControl ? this.control : null;
  }

  isDisabled = false;
  value: string = '';

  onChange = (val: string) => {};
  onTouched = () => {};

  onInput(target: EventTarget | null) {
    const htmlInputElement = target as HTMLInputElement | HTMLTextAreaElement;
    this.value = htmlInputElement.value;
    this.onChange(this.value);
  }

  writeValue(obj: any): void {
    this.value = obj ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (this.formControl) {
      isDisabled ? this.formControl.disable({ emitEvent: false }) : this.formControl.enable({ emitEvent: false });
    }
  }

  get isRequired(): boolean {
    return !!this.formControl?.hasValidator?.(Validators.required);
  }

  get showError(): boolean {
    return !!this.formControl && this.formControl.invalid && (this.formControl.touched || this.formControl.dirty);
  }

  get errorMessage(): string | null {
    if (!this.formControl || !this.showError) return null;

    if (this.formControl.hasError('pattern') && this.config?.validationMessages?.['pattern']) {
      return this.config?.validationMessages?.['pattern'];
    }

    if (this.formControl.hasError('required')) {
      return 'Toto pole je povinné.';
    }

    return 'Neplatná hodnota.';
  }
}
