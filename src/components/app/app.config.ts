import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import localeCs from '@angular/common/locales/cs';

import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeCs, 'cs');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
     { provide: LOCALE_ID, useValue: 'cs-CZ' },
  ]
};
