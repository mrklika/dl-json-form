import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import { appConfig, AppComponent } from './components/app';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
