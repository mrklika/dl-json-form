import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, forwardRef } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Config, Option } from '../../models';

@Component({
  selector: 'app-select-input',
  template: `
    @if (formControl) {
      <mat-form-field appearance="fill" style="width: 100%;">
        <mat-label>{{ config?.title }}</mat-label>
        <mat-select
          [value]="value"
          [formControl]="formControl"
          (selectionChange)="onSelect($event.value)"
          (blur)="onTouched()"
        >
        @for (option of optionList; track $index) {
          <mat-option [value]="option.const">
            {{ option.title }}
          </mat-option>
        }
        </mat-select>
      </mat-form-field>
    }
  `,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectInputComponent implements ControlValueAccessor {

  @Input() config?: Config;
  @Input() optionList?: Option[] = [];
  @Input() control?: AbstractControl;

  get formControl(): FormControl | null {
    return this.control instanceof FormControl ? this.control : null;
  }

  value: string = '';

  onChange = (val: string) => {};
  onTouched = () => {};

  onSelect(value: string) {
    this.value = value;
    this.onChange(value);
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
