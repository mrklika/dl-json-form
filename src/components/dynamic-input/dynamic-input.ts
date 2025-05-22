import {
  Component,
  Input,
  OnInit,
  ViewContainerRef,
  Injector,
  inject,
  ComponentRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Config } from '../../models';

@Component({
  selector: 'app-dynamic-field',
  imports: [CommonModule, ReactiveFormsModule],
  template: '',
})
export class DynamicFieldComponent implements OnInit {
  @Input() control!: AbstractControl;
  @Input() config!: Config;

  private readonly view = inject(ViewContainerRef);
  private readonly injector = inject(Injector);

  async ngOnInit() {
    const widgetType = this.config?.widgetType ?? 'text';
    const component = await this.loadComponent(widgetType);

    const cmpRef: ComponentRef<any> = this.view.createComponent(component, {
      injector: this.injector,
    });

    if ('control' in cmpRef.instance) {
      cmpRef.setInput('control', this.control);
    }

    if ('config' in cmpRef.instance) {
      cmpRef.setInput('config', {
        title: this.config?.title,
        validationMessages: this.config?.validationMessages,
      });
    }

    if ('optionList' in cmpRef.instance && this.config?.optionList) {
      cmpRef.setInput('optionList', this.config.optionList);
    }

    if ('isMultiline' in cmpRef.instance && widgetType === 'textarea') {
      cmpRef.setInput('isMultiline', true);
    }
  }

  private async loadComponent(type: string): Promise<any> {
    switch (type) {
      case 'text':
      case 'textarea': {
        const comp = await import('../text-input/text-input.component');
        return comp.TextInputComponent;
      }
      case 'select': {
        const comp = await import('../select-input/select-input.component');
        return comp.SelectInputComponent;
      }
      case 'date': {
        const comp = await import('../date-input/date-input.component');
        return comp.DateInputComponent;
      }
      default: {
        const comp = await import('../text-input/text-input.component');
        return comp.TextInputComponent;
      }
    }
  }
}
