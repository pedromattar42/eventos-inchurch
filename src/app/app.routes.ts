import { Routes } from '@angular/router';
import { AuthGuard, GuestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(c => c.LoginComponent),
    canActivate: [GuestGuard]
  },
  {
    path: '',
    loadChildren: () => import('./pages/pages.routes').then((m) => m.PAGES_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
