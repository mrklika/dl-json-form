import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormSchema, Property } from '../../models';
import { DynamicFieldComponent } from '../dynamic-input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule, MatCardModule, MatButtonModule, DynamicFieldComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  // #Data

  // Angular

  // Sync
  formConfPathList = [
    'assets/form-data.json',
    'assets/form-data2.json',
    'assets/form-data3.json',
  ];
  currentFormConfPathIndex = 0;
  get formGroup(): FormGroup | undefined {
    return this.formGroupSignal$();
  }

  // Async
  formDataSignal$ = signal<FormSchema | undefined>(undefined);
  layoutItemListSignal$ = computed(() => this.formDataSignal$()?.layout);
  propertyListSignal$ = computed(() => {
    const propertyList = this.formDataSignal$()?.properties;
    if (!propertyList) { return undefined; }
    return Object.entries(propertyList);
  });
  formGroupSignal$ = computed(() => {
    const formData = this.formDataSignal$();
    const propertyList = this.propertyListSignal$();
    if (!propertyList) { return undefined; }
    return this._buildFormGroup(propertyList, formData?.required);
  });

  constructor(private _http: HttpClient) {
    this.getFormConfigurationAndLoadFormData(0);
  }

getFormConfigurationAndLoadFormData(formConfPathIndex?: number) {
  let newIndex = (this.currentFormConfPathIndex + 1) % this.formConfPathList.length;
  this._loadFormData(formConfPathIndex ?? newIndex);
}

  private _loadFormData(currentFormConfPathIndex: number) {
    this._http.get<FormSchema>(this.formConfPathList[currentFormConfPathIndex]).subscribe({
      next: (res) => {
        this.currentFormConfPathIndex = currentFormConfPathIndex;
        this.formDataSignal$.set(res);
      },
      error: (err) => console.error('Error:', err)
    });
  }

  private _buildFormGroup(data: [string, Property][], requiredList?: string[]): FormGroup {
    const group: { [key: string]: FormControl } = {};

    for (const [key, config] of data) {
      const validators: ValidatorFn[] = [];

      if (config.pattern) {
        validators.push(Validators.pattern(config.pattern));
      }

      if (requiredList?.includes(key)) {
        validators.push(Validators.required);
      }

      group[key] = new FormControl('', { updateOn: 'blur', validators });
    }

    return new FormGroup(group);
  }

}
