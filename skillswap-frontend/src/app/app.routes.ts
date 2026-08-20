import { Routes } from '@angular/router';

import { Home } from './home/home';
import { Register } from './register/register';
import { Login } from './login/login';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'education',
    loadComponent: () =>
      import('./education/education').then(m => m.Education)
  },

  {
    path: 'skills',
    loadComponent: () =>
      import('./skills/skills').then(m => m.Skills)
  },
  {
  path: 'dashboard',
  loadComponent: () =>
    import('./dashboard/dashboard').then(m => m.Dashboard)
}

];