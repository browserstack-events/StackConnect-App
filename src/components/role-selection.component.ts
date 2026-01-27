import { Component, inject, input, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <h1 class="text-3xl font-bold text-gray-800 mb-2 text-center">{{ eventName() }}</h1>
        <p class="text-gray-600 mb-8 text-center">Select your role to access the dashboard</p>

        <div class="grid md:grid-cols-3 gap-4 mb-6">
          <a
            [routerLink]="['/event', id(), 'desk']"
            class="block p-6 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 hover:border-green-400 transition text-center"
          >
            <div class="text-4xl mb-3">📋</div>
            <h3 class="text-lg font-semibold text-gray-800">Admin Desk</h3>
            <p class="text-sm text-gray-600 mt-2">Full access to all attendees</p>
          </a>

          <a
            [routerLink]="['/event', id(), 'spoc']"
            class="block p-6 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-400 transition text-center"
          >
            <div class="text-4xl mb-3">👤</div>
            <h3 class="text-lg font-semibold text-gray-800">Sales SPOC</h3>
            <p class="text-sm text-gray-600 mt-2">View your assigned leads</p>
          </a>

          <a
            [routerLink]="['/event', id(), 'walkin']"
            class="block p-6 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 hover:border-purple-400 transition text-center"
          >
            <div class="text-4xl mb-3">🚶</div>
            <h3 class="text-lg font-semibold text-gray-800">Walk-in</h3>
            <p class="text-sm text-gray-600 mt-2">Register new attendees</p>
          </a>
        </div>

        <div class="text-center">
          <a routerLink="/" class="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Events
          </a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RoleSelectionComponent implements OnInit {
  private dataService = inject(DataService);
  private router = inject(Router);
  
  id = input.required<string>();
  eventName = computed(() => {
    const event = this.dataService.getEventById(this.id());
    return event?.name || 'Event';
  });

  async ngOnInit() {
    const eventId = this.id();
    
    // Try to get from localStorage first
    let event = this.dataService.getEventById(eventId);
    
    // If not found, fetch from master log
    if (!event) {
      console.log('Event not in localStorage, fetching from master log...');
      event = await this.dataService.getEventFromMasterLog(eventId);
    }
    
    if (!event) {
      console.error('Event not found');
      alert('Event not found. Please check the URL.');
      this.router.navigate(['/']);
      return;
    }
    
    console.log('✓ Event loaded:', event.name);
  }
}
