import { Routes } from '@angular/router';
import { PagesComponent } from './pages.component';

export const PAGES_ROUTES: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'create-event',
        loadComponent: () =>
          import('./create-event/create-event.component').then((m) => m.CreateEventComponent),
      },
      {
        path: 'edit-event/:id',
        loadComponent: () =>
          import('./edit-event/edit-event.component').then((m) => m.EditEventComponent),
      },
    ],
  },
];
