import { Routes } from '@angular/router';

import { Home } from './home/home';
import { Register } from './register/register';
import { Login } from './login/login';

import { authGuard } from './guards/auth-guard';


export const routes: Routes = [

  // ==========================================
  // HOME
  // ==========================================

  {
    path: '',
    component: Home
  },


  // ==========================================
  // AUTH
  // ==========================================

  {
    path: 'register',
    component: Register
  },

  {
    path: 'login',
    component: Login
  },


  // ==========================================
  // EDUCATION
  // ==========================================

  {
    path: 'education',

    loadComponent: () =>
      import('./education/education')
        .then(m => m.Education),

    canActivate: [
      authGuard
    ]
  },


  // ==========================================
  // SKILLS
  // ==========================================

  {
    path: 'skills',

    loadComponent: () =>
      import('./skills/skills')
        .then(m => m.Skills),

    canActivate: [
      authGuard
    ]
  },


  // ==========================================
  // DASHBOARD
  // ==========================================

  {
    path: 'dashboard',

    loadComponent: () =>
      import('./dashboard/dashboard')
        .then(m => m.Dashboard),

    canActivate: [
      authGuard
    ]
  },


  // ==========================================
  // FIND PEOPLE
  // ==========================================

  {
    path: 'find-skills',

    loadComponent: () =>
      import('./find-skills/find-skills')
        .then(m => m.FindSkills),

    canActivate: [
      authGuard
    ]
  },


  // ==========================================
  // PROFILE
  // ==========================================

  {
    path: 'profile',

    loadComponent: () =>
      import('./profile/profile')
        .then(m => m.Profile),

    canActivate: [
      authGuard
    ]
  },


  // ==========================================
  // REQUESTS
  // ==========================================

  {
    path: 'requests',

    loadComponent: () =>
      import('./requests/requests')
        .then(m => m.Requests),

    canActivate: [
      authGuard
    ]
  },


  // ==========================================
  // CONNECTIONS
  // ==========================================

  {
    path: 'connections',

    loadComponent: () =>
      import('./connections/connections')
        .then(m => m.Connections),

    canActivate: [
      authGuard
    ]
  },


  // ==========================================
  // CHAT
  // ==========================================

  {
    path: 'chat/:connectionId',

    loadComponent: () =>
      import('./chat/chat')
        .then(m => m.Chat),

    canActivate: [
      authGuard
    ]
  }

];