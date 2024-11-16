import { provideAnimations } from '@angular/platform-browser/animations';
import { TuiRootModule } from '@taiga-ui/core';
import {
    ApplicationConfig,
    provideZoneChangeDetection,
    importProvidersFrom,
    ErrorHandler,
    APP_INITIALIZER,
} from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { appRoutes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideHttpClient } from '@angular/common/http';
import * as Sentry from '@sentry/angular';

const firebaseConfig = {
    apiKey: 'AIzaSyDcueZQtZ8_EHxnzPTisM2xFMgIsqAUHpQ',
    authDomain: 'notes-list-f57e1.firebaseapp.com',
    projectId: 'notes-list-f57e1',
    storageBucket: 'notes-list-f57e1.appspot.com',
    messagingSenderId: '779322589328',
    appId: '1:779322589328:web:682460d4cabda684665815',
};

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(appRoutes),
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        importProvidersFrom([TuiRootModule]),
        provideHttpClient(),
        {
            provide: ErrorHandler,
            useValue: Sentry.createErrorHandler(),
        },
        {
            provide: Sentry.TraceService,
            deps: [Router],
        },
        {
            provide: APP_INITIALIZER,
            useFactory: () => () => {},
            deps: [Sentry.TraceService],
            multi: true,
        },
    ],
};
