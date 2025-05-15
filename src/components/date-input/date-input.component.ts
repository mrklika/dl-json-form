import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { Config } from '../../models';

@Component({
  selector: 'app-date-input',
  standalone: true,
  template: `
    <mat-form-field appearance="fill" style="width: 100%;">
      <mat-label>{{ config?.title }}</mat-label>
      <input
        matInput
        [matDatepicker]="picker"
        [value]="value"
        (focus)="picker.open()"
        (dateChange)="onDateChange($event.value)"
        (blur)="onTouched()"
      />
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
  `,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true
    },
    { provide: MAT_DATE_LOCALE, useValue: 'cs-CZ' }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateInputComponent implements ControlValueAccessor {

  @Input() config?: Config;
  value: string | null = null;

  onChange = (val: string | null) => {};
  onTouched = () => {};

  onDateChange(date: Date | null) {
    this.value = date ? date.toISOString() : null;
    this.onChange(this.value);
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
