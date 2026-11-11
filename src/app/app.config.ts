import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideRouter,
  withHashLocation,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { headerInterceptor } from './core/interceptor/header-interceptor.js';
import { provideToastr } from 'ngx-toastr';
import { errorInterceptor } from './core/interceptor/error-interceptor.js';
import { NgxSpinnerModule } from 'ngx-spinner';
import { loadingInterceptor } from './core/interceptor/loading-interceptor.js';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
      withViewTransitions(),
      withHashLocation(),
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([headerInterceptor, errorInterceptor, loadingInterceptor]),
    ),
    provideToastr({
      toastClass: 'ngx-toastr wasl-toast',
      positionClass: 'toast-top-center',

      timeOut: 4000,
      closeButton: true,
      preventDuplicates: true,
    }),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
      fallbackLang: 'en',
      lang: 'en',
    }),
    provideAppInitializer(() => {
      const translate = inject(TranslateService);
      translate.addLangs(['ar', 'en']);
      translate.use(localStorage.getItem('lang') || 'en');
    }),
    importProvidersFrom(NgxSpinnerModule),
  ],
};
