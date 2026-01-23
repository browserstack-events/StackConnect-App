import { Component, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      
      <div class="max-w-3xl w-full text-center mb-12">
        <h1 class="text-3xl font-bold text-gray-900">{{ eventName() }}</h1>
        <p class="text-gray-500 mt-2">Select your role to access the dashboard</p>
        <a routerLink="/" class="mt-4 inline-block text-sm text-teal-600 hover:underline">&larr; Back to Events</a>
      </div>

      <div class="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        <!-- Registration Desk -->
        <a [routerLink]="['/event', eventId(), 'desk']" 
           class="group bg-white p-8 rounded-2xl shadow-md border border-gray-200 hover:border-teal-500 hover:shadow-lg transition-all text-center flex flex-col items-center">
           <div class="bg-teal-50 p-4 rounded-full group-hover:bg-teal-100 transition-colors mb-6">
             <svg class="w-12 h-12 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
             </svg>
           </div>
           <h2 class="text-2xl font-bold text-gray-900 mb-2">Registration Desk</h2>
           <p class="text-gray-500 text-sm">Fast check-in mode. Access to all attendees and status management.</p>
        </a>

        <!-- Sales SPOC -->
        <a [routerLink]="['/event', eventId(), 'spoc']" 
           class="group bg-white p-8 rounded-2xl shadow-md border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all text-center flex flex-col items-center">
           <div class="bg-blue-50 p-4 rounded-full group-hover:bg-blue-100 transition-colors mb-6">
             <svg class="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
             </svg>
           </div>
           <h2 class="text-2xl font-bold text-gray-900 mb-2">Sales SPOC</h2>
           <p class="text-gray-500 text-sm">View your assigned attendees, track arrivals, and manage notes.</p>
        </a>
      </div>
    </div>
  `
})
export class RoleSelectionComponent {
  eventId = input.required<string>({ alias: 'id' });
  dataService = inject(DataService);

  eventName = computed(() => {
    const event = this.dataService.getEventById(this.eventId());
    return event ? event.name : 'Unknown Event';
  });
}