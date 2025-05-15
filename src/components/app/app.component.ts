import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormSchema, Property } from '../../models';
import { DynamicFieldComponent } from '../dynamic-input';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule, MatCardModule, DynamicFieldComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  // #Data

  // Angular

  // Sync
  get formGroup(): FormGroup | undefined {
    return this.formGroupSignal();
  }

  // Async
  formDataSignal = signal<FormSchema | undefined>(undefined);
  layoutItemListSignal = computed(() => this.formDataSignal()?.layout);
  propertyListSignal = computed(() => {
    const propertyList = this.formDataSignal()?.properties;
    if (!propertyList) { return undefined; }
    return Object.entries(propertyList);
  });
  formGroupSignal = computed(() => {
    const formData = this.formDataSignal();
    const propertyList = this.propertyListSignal();
    if (!propertyList) { return undefined; }
    return this._buildFormGroup(propertyList, formData?.required);
  });

  textFormControl = new FormControl();
  selectFormControl = new FormControl();
  dateFormControl = new FormControl();
  selectOptionList = [ { title: 'xxx', value: 'xxx' } ];


  constructor(private _http: HttpClient) {
    this._loadFormData();
  }

  private _loadFormData() {
    this._http.get<FormSchema>('assets/form-data.json').subscribe({
      next: (res) => this.formDataSignal.set(res),
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

      group[key] = new FormControl('', validators);
    }

    return new FormGroup(group);
  }

}
