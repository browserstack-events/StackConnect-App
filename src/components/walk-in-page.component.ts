import { Component, inject, input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-walk-in-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="mx-auto h-16 w-16 bg-teal-600 rounded-full flex items-center justify-center shadow-lg">
           <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
           </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">{{ eventName() }}</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Walk-in Registration
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          @if (!submitted()) {
            <form class="space-y-6" (ngSubmit)="submit()">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
                <div class="mt-1">
                  <input id="name" name="name" type="text" required [(ngModel)]="form.fullName" 
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-3 border"
                    placeholder="Jane Doe">
                </div>
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                <div class="mt-1">
                  <input id="email" name="email" type="email" required [(ngModel)]="form.email" 
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-3 border"
                    placeholder="jane@company.com">
                </div>
              </div>

              <div>
                <label for="company" class="block text-sm font-medium text-gray-700">Company / Organization</label>
                <div class="mt-1">
                  <input id="company" name="company" type="text" required [(ngModel)]="form.company" 
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-3 border"
                    placeholder="Acme Inc.">
                </div>
              </div>

              <div>
                <label for="contact" class="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
                <div class="mt-1">
                  <input id="contact" name="contact" type="text" [(ngModel)]="form.contact" 
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-3 border"
                    placeholder="+1 (555) 000-0000">
                </div>
              </div>

              <div>
                <button type="submit" [disabled]="isSubmitting() || !form.fullName || !form.email || !form.company"
                  class="flex w-full justify-center rounded-md border border-transparent bg-teal-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 transition-colors">
                  {{ isSubmitting() ? 'Registering...' : 'Complete Registration' }}
                </button>
              </div>
            </form>
          } @else {
             <div class="text-center py-8">
               <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                 <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                 </svg>
               </div>
               <h3 class="text-lg font-medium leading-6 text-gray-900">Registration Successful!</h3>
               <p class="mt-2 text-sm text-gray-500">
                 You have been checked in. Please collect your badge.
               </p>
               <button (click)="reset()" class="mt-6 text-teal-600 hover:text-teal-500 font-medium text-sm">
                 Register another person
               </button>
             </div>
          }
        </div>
      </div>
    </div>
  `
})
export class WalkInPageComponent implements OnInit {
  eventId = input.required<string>({ alias: 'id' });
  dataService = inject(DataService);
  router = inject(Router);

  eventName = signal('Loading Event...');
  eventData: any = null;

  form = { fullName: '', email: '', company: '', contact: '' };
  isSubmitting = signal(false);
  submitted = signal(false);

  ngOnInit() {
    const event = this.dataService.getEventById(this.eventId());
    if (event) {
      this.eventName.set(event.name);
      this.eventData = event;
      // Pre-set the sheet name in service so writes go to correct place
      this.dataService.sheetName.set(event.name);
    } else {
      this.eventName.set('Event Not Found');
    }
  }

  async submit() {
    if (!this.eventData) return;
    this.isSubmitting.set(true);
    
    const success = await this.dataService.addWalkInAttendee(this.form, this.eventData.sheetUrl);
    
    this.isSubmitting.set(false);
    if (success) {
      this.submitted.set(true);
    } else {
      alert('Registration failed. Please try again or contact support.');
    }
  }

  reset() {
    this.form = { fullName: '', email: '', company: '', contact: '' };
    this.submitted.set(false);
  }
}