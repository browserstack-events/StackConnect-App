import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page.component';
import { RoleSelectionComponent } from './components/role-selection.component';
import { SpocDashboardComponent } from './components/spoc-dashboard.component';
import { WalkInPageComponent } from './components/walk-in-page.component';

export const routes: Routes = [
  { 
    path: '', 
    component: LandingPageComponent 
  },
  {
    path: 'event/:id',
    component: RoleSelectionComponent
  },
  {
    path: 'event/:id/desk',
    component: SpocDashboardComponent,
    data: { mode: 'admin' }
  },
  {
    path: 'event/:id/spoc',
    component: SpocDashboardComponent,
    data: { mode: 'spoc' }
  },
  {
    path: 'event/:id/walkin',
    component: WalkInPageComponent
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];